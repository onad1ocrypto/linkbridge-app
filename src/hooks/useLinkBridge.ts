import { useState, useEffect, useRef, useCallback } from 'react';
import { DeviceInfo, FileTransferItem, ClipboardItem, DeviceType } from '../types';
import { sounds } from '../utils/audio';

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
  const [connectionType, setConnectionType] = useState<'ws' | 'http' | 'none'>('none');
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [files, setFiles] = useState<FileTransferItem[]>([]);
  const [clipboard, setClipboard] = useState<ClipboardItem[]>([]);
  const [notes, setNotes] = useState<string>('');
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

  const wsRef = useRef<WebSocket | null>(null);
  const sseRef = useRef<EventSource | null>(null);
  const pingIntervalRef = useRef<any>(null);
  const pingStartRef = useRef<number>(0);
  const lastSyncTimeRef = useRef<number>(0);

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

  // Dispatch message via WebSocket with instant HTTP API fallback
  const sendMessage = useCallback(
    async (msg: any) => {
      // Try WebSocket first
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        try {
          wsRef.current.send(JSON.stringify(msg));
          return true;
        } catch (e) {
          console.warn('WS send failed, using HTTP fallback', e);
        }
      }

      // HTTP Relay Fallback
      try {
        await fetch('/api/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomId,
            senderId: deviceId,
            action: msg,
          }),
        });
        return true;
      } catch (err) {
        console.error('HTTP action relay error:', err);
        return false;
      }
    },
    [roomId, deviceId]
  );

  // Message Handler for both WS and SSE/Polling
  const handleIncomingMessage = useCallback((data: any) => {
    if (!data || !data.type) return;

    switch (data.type) {
      case 'pong': {
        if (pingStartRef.current) {
          setLatency(Math.max(1, Date.now() - pingStartRef.current));
        }
        break;
      }

      case 'joined_success': {
        setDevices(data.devices || []);
        setFiles(data.files || []);
        setClipboard(data.clipboard || []);
        if (data.notes !== undefined) setNotes(data.notes);
        sounds.playConnect();
        break;
      }

      case 'device_joined': {
        setDevices(data.devices || []);
        sounds.playConnect();
        break;
      }

      case 'device_updated': {
        setDevices((prev) =>
          prev.map((d) => (d.deviceId === data.device.deviceId ? { ...d, ...data.device } : d))
        );
        break;
      }

      case 'device_left': {
        setDevices(data.devices || []);
        break;
      }

      case 'file_received': {
        setFiles((prev) => [data.file, ...prev.filter((f) => f.id !== data.file.id)]);
        sounds.playFileSent();
        break;
      }

      case 'clipboard_received': {
        setClipboard((prev) => [data.item, ...prev.filter((c) => c.id !== data.item.id)]);
        sounds.playClick();
        break;
      }

      case 'notes_synced': {
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
  }, []);

  // Connect WebSocket with Automatic HTTP/SSE Fallback
  useEffect(() => {
    let isMounted = true;
    let reconnectTimeout: any = null;
    let pollingInterval: any = null;

    // HTTP Join Initializer
    const joinViaHttp = async () => {
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
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setIsConnected(true);
            setConnectionType('http');
            setDevices(data.devices || []);
            setFiles(data.files || []);
            setClipboard(data.clipboard || []);
            if (data.notes !== undefined) setNotes(data.notes);
          }
        }
      } catch (err) {
        console.warn('HTTP join error:', err);
      }
    };

    // Polling fallback handler
    const startPollingFallback = () => {
      if (pollingInterval) clearInterval(pollingInterval);
      pollingInterval = setInterval(async () => {
        if (!isMounted) return;
        try {
          const res = await fetch(`/api/sync/${roomId}?since=${lastSyncTimeRef.current}`);
          if (res.ok) {
            const data = await res.json();
            lastSyncTimeRef.current = data.serverTime || Date.now();
            setIsConnected(true);
            if (data.devices) setDevices(data.devices);
            if (data.files) setFiles(data.files);
            if (data.clipboard) setClipboard(data.clipboard);
            if (data.notes !== undefined) setNotes(data.notes);
            if (Array.isArray(data.events)) {
              data.events.forEach((evt: any) => handleIncomingMessage(evt));
            }
          }
        } catch (e) {
          // ignore
        }
      }, 2000);
    };

    const connectWS = () => {
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch (e) {}
      }

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!isMounted) return;
          setIsConnected(true);
          setConnectionType('ws');

          ws.send(
            JSON.stringify({
              type: 'join',
              roomId,
              deviceId,
              deviceType: role,
              deviceName,
            })
          );

          if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              pingStartRef.current = Date.now();
              ws.send(JSON.stringify({ type: 'ping' }));
            }
          }, 4000);
        };

        ws.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            handleIncomingMessage(data);
          } catch (e) {
            console.error('WS parse error:', e);
          }
        };

        ws.onclose = () => {
          if (!isMounted) return;
          setConnectionType('http');
          // Switch to HTTP fallback immediately
          joinViaHttp();
          startPollingFallback();
          reconnectTimeout = setTimeout(connectWS, 4000);
        };

        ws.onerror = () => {
          if (!isMounted) return;
          joinViaHttp();
          startPollingFallback();
        };
      } catch (err) {
        joinViaHttp();
        startPollingFallback();
      }
    };

    // Initial Join via HTTP first for instant presence
    joinViaHttp();
    connectWS();
    startPollingFallback();

    return () => {
      isMounted = false;
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (pollingInterval) clearInterval(pollingInterval);
      if (wsRef.current) wsRef.current.close();
      if (sseRef.current) sseRef.current.close();
    };
  }, [roomId, role, deviceId, deviceName, handleIncomingMessage]);

  // Upload file
  const uploadFile = useCallback(
    async (file: File) => {
      setUploadProgress(15);
      try {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.onprogress = (e) => {
            if (e.lengthComputable) {
              setUploadProgress(Math.round((e.loaded / e.total) * 60));
            }
          };
          reader.readAsDataURL(file);
        });

        const base64Data = await base64Promise;
        setUploadProgress(75);

        const response = await fetch('/api/upload', {
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
        });

        if (!response.ok) {
          throw new Error('Gagal mengunggah file');
        }

        const resData = await response.json();
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(null), 1000);
        return resData.file;
      } catch (err: any) {
        console.error('File upload error:', err);
        setUploadProgress(null);
        throw err;
      }
    },
    [roomId, deviceName, role]
  );

  // Send Clipboard item
  const sendClipboard = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      const clean = text.trim();
      sendMessage({
        type: 'clipboard_send',
        text: clean,
        senderName: deviceName,
        senderType: role,
      });

      const localItem: ClipboardItem = {
        id: 'clip_' + Math.random().toString(36).substring(2, 9),
        text: clean,
        senderName: deviceName,
        senderType: role,
        timestamp: Date.now(),
      };
      setClipboard((prev) => [localItem, ...prev]);
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

  // Canonical shareable URL for HP
  const shareUrl = `${canonicalAppUrl || window.location.origin}${window.location.pathname}?room=${roomId}&role=phone`;

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
    cameraFrame,
    cameraActive,
  };
}
