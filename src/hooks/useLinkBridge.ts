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
      if (qRoom) return qRoom.toUpperCase();
    }
    const saved = localStorage.getItem('linkbridge_room_id');
    if (saved) return saved;
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

  // Unified Multi-Transport Message Dispatcher (WebRTC P2P + WebSocket + BroadcastChannel + HTTP fallback)
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

      // 1. Send via direct WebRTC DataChannels (Zero latency, works everywhere including Vercel)
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

      // 4. HTTP API Relay Fallback (if running Node server)
      if (!delivered && connectionType === 'http') {
        try {
          await fetch('/api/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              roomId,
              senderId: deviceId,
              action: payload,
            }),
          });
        } catch (err) {}
      }

      return true;
    },
    [roomId, deviceId, deviceName, role, connectionType]
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
          if (data.devices) {
            setDevices(data.devices);
          }
          if (data.files) setFiles(data.files);
          if (data.clipboard) setClipboard(data.clipboard);
          if (data.notes !== undefined) setNotes(data.notes);
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
            lastAction: `click_${data.button || 'left'}`,
            timestamp: Date.now(),
          }));
          sounds.playClick();
          break;
        }

        case 'mouse_scroll': {
          const delta = data.scrollY || 0;
          setRemoteMouse((prev) => ({
            ...prev,
            scrollDeltaY: delta,
            scrollY: Math.max(0, Math.min(1000, (prev.scrollY || 0) + delta)),
            lastAction: `scroll_${delta > 0 ? 'down' : 'up'}`,
            timestamp: Date.now(),
          }));
          break;
        }

        case 'presentation_action': {
          setPresentationState((prev) => {
            let nextSlide = prev.slideIndex;
            if (data.action === 'next') nextSlide = prev.slideIndex + 1;
            if (data.action === 'prev') nextSlide = Math.max(0, prev.slideIndex - 1);
            if (data.action === 'first') nextSlide = 0;
            return {
              ...prev,
              slideIndex: nextSlide,
              laserActive: data.laserActive ?? prev.laserActive,
              laserX: data.laserX ?? prev.laserX,
              laserY: data.laserY ?? prev.laserY,
            };
          });
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
          setMediaState((prev) => ({
            ...prev,
            lastAction: data.action,
            timestamp: Date.now(),
          }));
          sounds.playClick();
          break;
        }

        case 'keyboard_input': {
          setKeyboardState((prev) => ({
            ...prev,
            lastTyped: (prev.lastTyped ? prev.lastTyped + ' ' : '') + (data.text || ''),
            history: [data.text, ...prev.history].slice(0, 20),
            timestamp: Date.now(),
          }));
          sounds.playClick();
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

  // Initialize Hybrid Network Layer (PeerJS P2P + BroadcastChannel + WebSocket)
  useEffect(() => {
    let isMounted = true;
    const cleanRoom = roomId.replace(/[^A-Z0-9]/gi, '').toLowerCase();

    // 1. Setup Local BroadcastChannel (Syncs all tabs/windows in same browser)
    try {
      const bc = new BroadcastChannel(`linkbridge_${cleanRoom}`);
      broadcastChannelRef.current = bc;
      bc.onmessage = (event) => {
        if (!isMounted) return;
        handleIncomingMessage(event.data);
      };
    } catch (e) {}

    // 2. Setup PeerJS P2P WebRTC (Connects Phone to Laptop anywhere, including Vercel)
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
            { urls: 'stun:stun2.l.google.com:19302' },
          ],
        },
      });
      peerRef.current = peerInstance;

      peerInstance.on('open', (id) => {
        if (!isMounted) return;
        setIsConnected(true);
        setConnectionType('p2p');

        // If Phone role: automatically connect to Laptop Host
        if (role === 'phone') {
          const conn = peerInstance!.connect(hostPeerId, { reliable: true });
          setupDataConnection(conn);
        }
      });

      // Handle Incoming Connections (Laptop receives Phone)
      peerInstance.on('connection', (conn) => {
        if (!isMounted) return;
        setupDataConnection(conn);
      });

      peerInstance.on('error', (err: any) => {
        // If host ID is taken (e.g. another tab is host), try connecting as client
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
    } catch (err) {
      console.warn('PeerJS init error, using fallback:', err);
    }

    function setupDataConnection(conn: DataConnection) {
      conn.on('open', () => {
        peerConnectionsRef.current.set(conn.peer, conn);
        setIsConnected(true);
        setConnectionType('p2p');

        // Announce device presence over P2P DataChannel
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

      conn.on('error', () => {
        peerConnectionsRef.current.delete(conn.peer);
      });
    }

    // 3. Setup WebSocket Server Connection (if Node backend is available)
    let ws: WebSocket | null = null;
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
    } catch (e) {}

    return () => {
      isMounted = false;
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
      peerConnectionsRef.current.forEach((c) => c.close());
      peerConnectionsRef.current.clear();
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [roomId, role, deviceId, deviceName, handleIncomingMessage]);

  // Upload file (Supports direct P2P transfer and Base64 buffer)
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

        // Broadcast to P2P and connected peers
        sendMessage({
          type: 'file_received',
          file: fileMeta,
        });

        // Also try server upload endpoint if available
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
