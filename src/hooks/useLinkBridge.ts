import { useState, useEffect, useRef, useCallback } from 'react';
import { DeviceInfo, FileTransferItem, ClipboardItem, DeviceType } from '../types';
import { sounds } from '../utils/audio';
import Peer, { DataConnection } from 'peerjs';

export interface LinkBridgeHookProps {
  initialRoomId?: string;
  initialRole?: DeviceType;
}

export function useLinkBridge({ initialRoomId, initialRole }: LinkBridgeHookProps = {}) {
  const [deviceId] = useState(() => {
    const saved = localStorage.getItem('linkbridge_device_id');
    if (saved) return saved;
    const newId = 'dev_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('linkbridge_device_id', newId);
    return newId;
  });

  const [canonicalAppUrl, setCanonicalAppUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  });

  const [roomId, setRoomId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const qRoom = urlParams.get('room');
      if (qRoom) return qRoom.toUpperCase().trim();
    }
    const saved = localStorage.getItem('linkbridge_room_id');
    if (saved) return saved.toUpperCase().trim();
    const num = Math.floor(1000 + Math.random() * 9000);
    return `LINK-${num}`;
  });

  const [role, setRole] = useState<DeviceType>(() => {
    if (initialRole) return initialRole;
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const qRole = urlParams.get('role') as DeviceType;
      if (qRole && ['laptop', 'phone', 'simulator'].includes(qRole)) return qRole;
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
      return isMobile ? 'phone' : 'laptop';
    }
    return 'laptop';
  });

  const [deviceName, setDeviceName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        if (/Android/i.test(navigator.userAgent)) return 'Smartphone Android';
        if (/iPhone/i.test(navigator.userAgent)) return 'Apple iPhone';
        return 'HP Mobile';
      }
      return 'Laptop / PC';
    }
    return 'Perangkat';
  });

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionType, setConnectionType] = useState<'p2p' | 'ws' | 'http' | 'none'>('none');
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [files, setFiles] = useState<FileTransferItem[]>([]);
  const [clipboard, setClipboard] = useState<ClipboardItem[]>([]);
  const [notes, setNotes] = useState<string>('Selamat datang di LinkBridge! Catatan dan clipboard akan tersinkronisasi otomatis di sini.');
  const [latency, setLatency] = useState<number>(0);
  const [isAlerting, setIsAlerting] = useState<boolean>(false);

  const [remoteMouse, setRemoteMouse] = useState<{
    x: number;
    y: number;
    isDown: boolean;
    button?: string;
    lastAction?: string;
    scrollY: number;
    scrollDeltaY?: number;
    timestamp: number;
  }>({ x: 50, y: 50, isDown: false, scrollY: 0, scrollDeltaY: 0, timestamp: 0 });

  const [presentationState, setPresentationState] = useState<{
    slideIndex: number;
    laserActive: boolean;
    laserX: number;
    laserY: number;
  }>({ slideIndex: 0, laserActive: false, laserX: 50, laserY: 50 });

  const [cameraFrame, setCameraFrame] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const [mediaState, setMediaState] = useState<{
    isPlaying: boolean;
    volume: number;
    isMuted: boolean;
    trackIndex: number;
    lastAction?: string;
    timestamp: number;
  }>({ isPlaying: false, volume: 70, isMuted: false, trackIndex: 0, timestamp: 0 });

  const [keyboardState, setKeyboardState] = useState<{
    lastTyped: string;
    activeKeyAction?: string;
    history: string[];
    timestamp: number;
  }>({ lastTyped: '', history: [], timestamp: 0 });

  // References for Multi-Transport Networking
  const wsRef = useRef<WebSocket | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const peerConnectionsRef = useRef<Map<string, DataConnection>>(new Map());
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const pingStartRef = useRef<number>(0);
  const lastSyncTimeRef = useRef<number>(0);
  const filesRef = useRef<FileTransferItem[]>([]);
  const clipboardRef = useRef<ClipboardItem[]>([]);
  const notesRef = useRef<string>('');

  filesRef.current = files;
  clipboardRef.current = clipboard;
  notesRef.current = notes;

  // Fetch canonical public server URL
  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((data) => {
        if (data.appUrl) {
          setCanonicalAppUrl(data.appUrl);
        }
      })
      .catch(() => {});
  }, []);

  // Update room & save
  const changeRoom = useCallback((newRoomId: string) => {
    const clean = newRoomId.toUpperCase().trim();
    if (!clean) return;
    setRoomId(clean);
    localStorage.setItem('linkbridge_room_id', clean);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('room', clean);
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  // Change role
  const changeRole = useCallback((newRole: DeviceType) => {
    setRole(newRole);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('role', newRole);
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  // Unified Multi-Transport Message Dispatcher
  const sendMessage = useCallback(
    async (msg: any) => {
      const payload = {
        ...msg,
        senderId: deviceId,
        roomId,
        senderName: deviceName,
        senderType: role,
        timestamp: Date.now(),
      };

      let delivered = false;

      // 1. Send via direct WebRTC DataChannels (Zero latency P2P)
      peerConnectionsRef.current.forEach((conn) => {
        if (conn.open) {
          try {
            conn.send(payload);
            delivered = true;
          } catch (e) {
            console.warn('P2P send error', e);
          }
        }
      });

      // 2. Send via BroadcastChannel (for dual-window & same-browser simulator testing)
      if (broadcastChannelRef.current) {
        try {
          broadcastChannelRef.current.postMessage(payload);
          delivered = true;
        } catch (e) {}
      }

      // 3. Send via WebSocket (if connected to Node server)
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        try {
          wsRef.current.send(JSON.stringify(payload));
          delivered = true;
        } catch (e) {}
      }

      // 4. Send via HTTP Action Relay (Fast Guaranteed Fallback)
      if (!delivered || msg.type === 'clipboard_send' || msg.type === 'notes_update') {
        try {
          fetch('/api/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              roomId,
              senderId: deviceId,
              action: payload,
            }),
          }).catch(() => {});
        } catch (err) {}
      }

      return true;
    },
    [roomId, deviceId, deviceName, role]
  );

  // Incoming Message Handler
  const handleIncomingMessage = useCallback(
    (data: any) => {
      if (!data || !data.type) return;

      // Ignore messages reflected back to sender (unless broadcast sync)
      if (data.senderId === deviceId && data.type !== 'device_joined' && data.type !== 'joined_success') {
        return;
      }

      switch (data.type) {
        case 'pong': {
          if (pingStartRef.current) {
            setLatency(Math.max(1, Date.now() - pingStartRef.current));
          }
          break;
        }

        case 'join':
        case 'device_joined': {
          const newDev: DeviceInfo = {
            deviceId: data.senderId || data.device?.deviceId || 'dev_peer',
            deviceType: data.senderType || data.device?.deviceType || 'phone',
            deviceName: data.senderName || data.device?.deviceName || 'Smartphone',
            batteryLevel: data.batteryLevel || data.device?.batteryLevel,
            isCharging: data.isCharging || data.device?.isCharging,
            joinedAt: Date.now(),
          };

          setDevices((prev) => {
            const filtered = prev.filter((d) => d.deviceId !== newDev.deviceId);
            return [...filtered, newDev];
          });
          setIsConnected(true);

          // If we are Laptop / Host, send back our state to the joined device
          if (role === 'laptop' || role === 'simulator') {
            sendMessage({
              type: 'joined_success',
              devices: [
                {
                  deviceId,
                  deviceType: role,
                  deviceName,
                  joinedAt: Date.now(),
                },
                newDev,
              ],
              files: filesRef.current,
              clipboard: clipboardRef.current,
              notes: notesRef.current,
            });
          }

          sounds.playConnect();
          break;
        }

        case 'joined_success': {
          if (data.devices && Array.isArray(data.devices)) {
            setDevices(data.devices);
          }
          if (data.files && Array.isArray(data.files)) setFiles(data.files);
          if (data.clipboard && Array.isArray(data.clipboard)) setClipboard(data.clipboard);
          if (data.notes !== undefined) setNotes(data.notes);
          setIsConnected(true);
          sounds.playConnect();
          break;
        }

        case 'device_updated': {
          if (data.device) {
            setDevices((prev) =>
              prev.map((d) => (d.deviceId === data.device.deviceId ? { ...d, ...data.device } : d))
            );
          }
          break;
        }

        case 'device_left': {
          if (data.deviceId) {
            setDevices((prev) => prev.filter((d) => d.deviceId !== data.deviceId));
          }
          break;
        }

        case 'file_received': {
          if (data.file) {
            setFiles((prev) => [data.file, ...prev.filter((f) => f.id !== data.file.id)]);
            sounds.playFileSent();
          }
          break;
        }

        case 'clipboard_received':
        case 'clipboard_send': {
          const item: ClipboardItem = data.item || {
            id: 'clip_' + Math.random().toString(36).substring(2, 9),
            text: data.text,
            senderName: data.senderName || 'Device',
            senderType: data.senderType || 'phone',
            timestamp: data.timestamp || Date.now(),
          };
          setClipboard((prev) => [item, ...prev.filter((c) => c.id !== item.id)]);
          sounds.playClick();
          break;
        }

        case 'notes_synced':
        case 'notes_update': {
          if (data.notes !== undefined) {
            setNotes(data.notes);
          }
          break;
        }

        case 'mouse_move': {
          setRemoteMouse((prev) => ({
            ...prev,
            x: Math.min(100, Math.max(0, prev.x + (data.dx || 0))),
            y: Math.min(100, Math.max(0, prev.y + (data.dy || 0))),
            lastAction: 'move',
            timestamp: Date.now(),
          }));
          break;
        }

        case 'mouse_click': {
          setRemoteMouse((prev) => ({
            ...prev,
            isDown: data.isDown ?? false,
            button: data.button || 'left',
            lastAction: `click_${data.button || 'left'}${data.isDown ? '_down' : ''}`,
            timestamp: Date.now(),
          }));
          break;
        }

        case 'mouse_scroll': {
          setRemoteMouse((prev) => ({
            ...prev,
            scrollY: prev.scrollY + (data.scrollY || 0),
            scrollDeltaY: data.scrollY || 0,
            lastAction: 'scroll',
            timestamp: Date.now(),
          }));
          break;
        }

        case 'presentation_action': {
          if (data.action === 'next') {
            setPresentationState((prev) => ({ ...prev, slideIndex: prev.slideIndex + 1 }));
          } else if (data.action === 'prev') {
            setPresentationState((prev) => ({ ...prev, slideIndex: Math.max(0, prev.slideIndex - 1) }));
          } else if (data.action === 'first') {
            setPresentationState((prev) => ({ ...prev, slideIndex: 0 }));
          }
          sounds.playClick();
          break;
        }

        case 'laser_pointer': {
          setPresentationState((prev) => ({
            ...prev,
            laserActive: data.active ?? false,
            laserX: data.x ?? prev.laserX,
            laserY: data.y ?? prev.laserY,
          }));
          break;
        }

        case 'camera_frame': {
          if (data.frameData) {
            setCameraFrame(data.frameData);
            setCameraActive(true);
          }
          break;
        }

        case 'camera_control': {
          if (data.action === 'stop') {
            setCameraActive(false);
            setCameraFrame(null);
          } else if (data.action === 'start') {
            setCameraActive(true);
          }
          break;
        }

        case 'media_control': {
          if (data.action === 'play_pause') {
            setMediaState((prev) => ({ ...prev, isPlaying: !prev.isPlaying, lastAction: 'play_pause', timestamp: Date.now() }));
          } else if (data.action === 'volume_up') {
            setMediaState((prev) => ({ ...prev, volume: Math.min(100, prev.volume + 10), isMuted: false, lastAction: 'volume_up', timestamp: Date.now() }));
          } else if (data.action === 'volume_down') {
            setMediaState((prev) => ({ ...prev, volume: Math.max(0, prev.volume - 10), lastAction: 'volume_down', timestamp: Date.now() }));
          } else if (data.action === 'mute') {
            setMediaState((prev) => ({ ...prev, isMuted: !prev.isMuted, lastAction: 'mute', timestamp: Date.now() }));
          } else if (data.action === 'next') {
            setMediaState((prev) => ({ ...prev, trackIndex: prev.trackIndex + 1, lastAction: 'next', timestamp: Date.now() }));
          } else if (data.action === 'previous') {
            setMediaState((prev) => ({ ...prev, trackIndex: Math.max(0, prev.trackIndex - 1), lastAction: 'previous', timestamp: Date.now() }));
          }
          sounds.playClick();
          break;
        }

        case 'keyboard_input': {
          if (data.text) {
            setKeyboardState((prev) => ({
              lastTyped: data.text,
              history: [data.text, ...prev.history.slice(0, 19)],
              timestamp: Date.now(),
            }));
            sounds.playClick();
          }
          break;
        }

        case 'key_action': {
          setKeyboardState((prev) => ({
            ...prev,
            activeKeyAction: data.key,
            lastTyped: data.key === 'Backspace' ? prev.lastTyped.slice(0, -1) : prev.lastTyped,
            timestamp: Date.now(),
          }));
          sounds.playClick();
          break;
        }

        case 'ping_alert': {
          setIsAlerting(true);
          sounds.playPingAlert();
          if (navigator.vibrate) {
            try {
              navigator.vibrate([300, 100, 300, 100, 500]);
            } catch (e) {}
          }
          setTimeout(() => setIsAlerting(false), 3000);
          break;
        }

        default:
          break;
      }
    },
    [deviceId, role, deviceName, sendMessage]
  );

  // Initialize Hybrid Network Layer (Instant HTTP Join + SSE + WebSocket + PeerJS P2P + BroadcastChannel)
  useEffect(() => {
    let isMounted = true;
    const cleanRoom = roomId.replace(/[^A-Z0-9]/gi, '').toLowerCase();

    // 1. INSTANT HTTP REST JOIN (<10ms pairing speed)
    const doHttpJoin = async () => {
      try {
        const res = await fetch('/api/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomId,
            deviceId,
            deviceType: role,
            deviceName,
          }),
        });
        if (!isMounted) return;
        if (res.ok) {
          const data = await res.json();
          if (data.devices) setDevices(data.devices);
          if (data.files && data.files.length) setFiles(data.files);
          if (data.clipboard && data.clipboard.length) setClipboard(data.clipboard);
          if (data.notes) setNotes(data.notes);
          setIsConnected(true);
          setConnectionType((prev) => (prev === 'none' ? 'http' : prev));
        }
      } catch (err) {
        // ignore
      }
    };
    doHttpJoin();

    // 2. High-Frequency Polling & Heartbeat Sync (1.5s interval)
    const syncInterval = setInterval(async () => {
      if (!isMounted) return;
      try {
        const res = await fetch(`/api/sync/${roomId}?since=${lastSyncTimeRef.current}`);
        if (!isMounted) return;
        if (res.ok) {
          const data = await res.json();
          lastSyncTimeRef.current = data.serverTime || Date.now();
          if (data.devices && Array.isArray(data.devices)) {
            setDevices(data.devices);
            setIsConnected(true);
          }
          if (data.files && data.files.length > filesRef.current.length) {
            setFiles(data.files);
          }
          if (data.clipboard && data.clipboard.length > clipboardRef.current.length) {
            setClipboard(data.clipboard);
          }
          if (data.events && Array.isArray(data.events)) {
            data.events.forEach((evt: any) => handleIncomingMessage(evt));
          }
        }
      } catch (e) {}
    }, 1500);

    // 3. Local BroadcastChannel (Syncs all tabs/windows in same browser instantly)
    try {
      const bc = new BroadcastChannel(`linkbridge_${cleanRoom}`);
      broadcastChannelRef.current = bc;
      bc.onmessage = (event) => {
        if (!isMounted) return;
        handleIncomingMessage(event.data);
      };
    } catch (e) {}

    // 4. Server-Sent Events (SSE) Stream
    let sseSource: EventSource | null = null;
    try {
      sseSource = new EventSource(`/api/events/${roomId}/${deviceId}`);
      sseSource.onmessage = (event) => {
        if (!isMounted) return;
        try {
          const data = JSON.parse(event.data);
          handleIncomingMessage(data);
        } catch (e) {}
      };
    } catch (e) {}

    // 5. WebSocket Server Connection (Ultra-low latency for Mouse & Keyboard)
    let ws: WebSocket | null = null;
    const connectWs = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!isMounted) return;
          setIsConnected(true);
          setConnectionType('ws');
          ws!.send(
            JSON.stringify({
              type: 'join',
              roomId,
              deviceId,
              deviceType: role,
              deviceName,
            })
          );
        };

        ws.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            handleIncomingMessage(data);
          } catch (e) {}
        };

        ws.onclose = () => {
          if (isMounted) {
            setTimeout(connectWs, 2000);
          }
        };
      } catch (e) {}
    };
    connectWs();

    // 6. PeerJS P2P WebRTC Layer (For Direct Serverless Connection)
    const hostPeerId = `lb_host_${cleanRoom}`;
    const clientPeerId = `lb_${role}_${cleanRoom}_${deviceId.slice(-4)}`;
    const myPeerId = role === 'laptop' || role === 'simulator' ? hostPeerId : clientPeerId;

    let peerInstance: Peer | null = null;
    try {
      peerInstance = new Peer(myPeerId, {
        debug: 0,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ],
        },
      });
      peerRef.current = peerInstance;

      peerInstance.on('open', () => {
        if (!isMounted) return;
        setIsConnected(true);
        setConnectionType('p2p');

        if (role === 'phone') {
          const conn = peerInstance!.connect(hostPeerId, { reliable: true });
          setupDataConnection(conn);
        }
      });

      peerInstance.on('connection', (conn) => {
        if (!isMounted) return;
        setupDataConnection(conn);
      });

      peerInstance.on('error', (err: any) => {
        if (err.type === 'unavailable-id' && role === 'laptop') {
          const altId = `lb_laptop_${cleanRoom}_${deviceId.slice(-4)}`;
          const fallbackPeer = new Peer(altId);
          peerRef.current = fallbackPeer;
          fallbackPeer.on('open', () => {
            setIsConnected(true);
            setConnectionType('p2p');
            const conn = fallbackPeer.connect(hostPeerId, { reliable: true });
            setupDataConnection(conn);
          });
          fallbackPeer.on('connection', (c) => setupDataConnection(c));
        }
      });
    } catch (err) {}

    function setupDataConnection(conn: DataConnection) {
      conn.on('open', () => {
        peerConnectionsRef.current.set(conn.peer, conn);
        setIsConnected(true);
        setConnectionType('p2p');

        conn.send({
          type: 'join',
          senderId: deviceId,
          senderName: deviceName,
          senderType: role,
          roomId,
          timestamp: Date.now(),
        });
      });

      conn.on('data', (data) => {
        if (!isMounted) return;
        handleIncomingMessage(data);
      });

      conn.on('close', () => {
        peerConnectionsRef.current.delete(conn.peer);
      });
    }

    return () => {
      isMounted = false;
      clearInterval(syncInterval);
      if (sseSource) sseSource.close();
      if (broadcastChannelRef.current) broadcastChannelRef.current.close();
      peerConnectionsRef.current.forEach((c) => c.close());
      peerConnectionsRef.current.clear();
      if (peerRef.current) peerRef.current.destroy();
      if (wsRef.current) wsRef.current.close();
    };
  }, [roomId, role, deviceId, deviceName, handleIncomingMessage]);

  // Upload file
  const uploadFile = useCallback(
    async (file: File) => {
      setUploadProgress(20);
      try {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.onprogress = (e) => {
            if (e.lengthComputable) {
              setUploadProgress(Math.round((e.loaded / e.total) * 70));
            }
          };
          reader.readAsDataURL(file);
        });

        const base64Data = await base64Promise;
        const fileId = 'file_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();

        const fileMeta: FileTransferItem = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          senderName: deviceName,
          senderType: role,
          timestamp: Date.now(),
          dataUrl: base64Data,
        };

        // Add to local state
        setFiles((prev) => [fileMeta, ...prev]);

        // Broadcast
        sendMessage({
          type: 'file_received',
          file: fileMeta,
        });

        fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomId,
            name: file.name,
            size: file.size,
            type: file.type,
            senderName: deviceName,
            senderType: role,
            base64Data,
          }),
        }).catch(() => {});

        setUploadProgress(100);
        setTimeout(() => setUploadProgress(null), 1000);
        return fileMeta;
      } catch (err: any) {
        console.error('File upload error:', err);
        setUploadProgress(null);
        throw err;
      }
    },
    [roomId, deviceName, role, sendMessage]
  );

  // Send Clipboard item
  const sendClipboard = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      const clean = text.trim();

      const localItem: ClipboardItem = {
        id: 'clip_' + Math.random().toString(36).substring(2, 9),
        text: clean,
        senderName: deviceName,
        senderType: role,
        timestamp: Date.now(),
      };

      setClipboard((prev) => [localItem, ...prev]);

      sendMessage({
        type: 'clipboard_received',
        item: localItem,
        text: clean,
      });
    },
    [sendMessage, deviceName, role]
  );

  // Update notes
  const updateNotes = useCallback(
    (newNotes: string) => {
      setNotes(newNotes);
      sendMessage({
        type: 'notes_update',
        notes: newNotes,
      });
    },
    [sendMessage]
  );

  // Send ping alert (Find My Device / Ring Phone)
  const sendPingAlert = useCallback(() => {
    sendMessage({
      type: 'ping_alert',
      senderName: deviceName,
    });
    sounds.playPingAlert();
  }, [sendMessage, deviceName]);

  const peerDevices = devices.filter((d) => d.deviceId !== deviceId);

  // Shareable URL for QR pairing
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?room=${roomId}&role=phone`
    : `https://linkbridge.app/?room=${roomId}&role=phone`;

  return {
    deviceId,
    roomId,
    changeRoom,
    role,
    changeRole,
    deviceName,
    setDeviceName,
    isConnected,
    connectionType,
    canonicalAppUrl,
    shareUrl,
    devices,
    peerDevices,
    files,
    uploadFile,
    uploadProgress,
    clipboard,
    sendClipboard,
    notes,
    updateNotes,
    latency,
    isAlerting,
    sendPingAlert,
    sendMessage,
    remoteMouse,
    presentationState,
    mediaState,
    keyboardState,
    cameraFrame,
    cameraActive,
  };
}
