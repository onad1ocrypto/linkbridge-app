import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';

interface ConnectedClient {
  ws?: WebSocket;
  sseRes?: express.Response;
  deviceId: string;
  roomId: string;
  deviceType: 'laptop' | 'phone' | 'simulator';
  deviceName: string;
  batteryLevel?: number;
  isCharging?: boolean;
  joinedAt: number;
  lastSeen: number;
}

interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  senderName: string;
  senderType: string;
  timestamp: number;
  dataUrl?: string;
}

interface ClipboardItem {
  id: string;
  text: string;
  senderName: string;
  senderType: 'laptop' | 'phone' | 'simulator';
  timestamp: number;
}

// In-memory state
const clients = new Map<string, ConnectedClient>();
const rooms = new Map<
  string,
  {
    createdAt: number;
    files: FileMetadata[];
    clipboard: ClipboardItem[];
    notes: string;
    recentEvents: Array<{ id: string; event: any; timestamp: number }>;
  }
>();

// File store for uploaded files
const fileStore = new Map<string, { meta: FileMetadata; buffer: Buffer }>();

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const PORT = 3000;

  // JSON payload parser with large limit for file transfer & previews
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ extended: true, limit: '100mb' }));

  // Helper to ensure room exists
  const getOrCreateRoom = (roomId: string) => {
    const cleanId = roomId.toUpperCase().trim();
    if (!rooms.has(cleanId)) {
      rooms.set(cleanId, {
        createdAt: Date.now(),
        files: [],
        clipboard: [],
        notes: 'Selamat datang di LinkBridge! Catatan dan clipboard akan tersinkronisasi otomatis di sini.',
        recentEvents: [],
      });
    }
    return rooms.get(cleanId)!;
  };

  // Helper to broadcast to room across both WebSocket and SSE/HTTP
  function broadcastToRoom(roomId: string, message: any, excludeDeviceId?: string) {
    const cleanId = roomId.toUpperCase().trim();
    const payload = JSON.stringify(message);

    // Save recent events in room buffer (for polling / catchup)
    const room = getOrCreateRoom(cleanId);
    room.recentEvents.unshift({
      id: 'evt_' + Math.random().toString(36).substring(2, 9),
      event: message,
      timestamp: Date.now(),
    });
    if (room.recentEvents.length > 60) room.recentEvents.pop();

    // Broadcast to WebSocket clients
    for (const [id, client] of clients.entries()) {
      if (client.roomId === cleanId && id !== excludeDeviceId) {
        if (client.ws && client.ws.readyState === WebSocket.OPEN) {
          try {
            client.ws.send(payload);
          } catch (e) {
            console.error('WS send error:', e);
          }
        }
        // Broadcast to SSE clients
        if (client.sseRes && !client.sseRes.writableEnded) {
          try {
            client.sseRes.write(`data: ${payload}\n\n`);
          } catch (e) {
            // ignore
          }
        }
      }
    }
  }

  // --- API Routes ---

  // Configuration API (returns canonical public App URL)
  app.get('/api/config', (req, res) => {
    const proto = req.headers['x-forwarded-proto'] || (req.secure ? 'https' : 'http');
    const host = req.headers['x-forwarded-host'] || req.get('host') || `localhost:${PORT}`;
    const detectedUrl = process.env.APP_URL || `${proto}://${host}`;
    res.json({
      appUrl: detectedUrl,
      port: PORT,
      timestamp: Date.now(),
    });
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      activeClients: clients.size,
      activeRooms: rooms.size,
      timestamp: Date.now(),
    });
  });

  // Get Room Details
  app.get('/api/rooms/:roomId', (req, res) => {
    const cleanId = req.params.roomId.toUpperCase().trim();
    const room = rooms.get(cleanId);
    const now = Date.now();

    const roomClients = Array.from(clients.values())
      .filter((c) => c.roomId === cleanId && now - c.lastSeen < 60000)
      .map((c) => ({
        deviceId: c.deviceId,
        deviceType: c.deviceType,
        deviceName: c.deviceName,
        batteryLevel: c.batteryLevel,
        isCharging: c.isCharging,
        joinedAt: c.joinedAt,
      }));

    res.json({
      exists: !!room,
      roomId: cleanId,
      devices: roomClients,
      files: room?.files || [],
      clipboard: room?.clipboard || [],
      notes: room?.notes || '',
    });
  });

  // HTTP Join / Register Endpoint
  app.post('/api/join', (req, res) => {
    const { roomId, deviceId, deviceType, deviceName, batteryLevel, isCharging } = req.body;
    if (!roomId) return res.status(400).json({ error: 'Room ID required' });

    const cleanRoomId = roomId.toUpperCase().trim();
    const cleanDeviceId = deviceId || 'dev_' + Math.random().toString(36).substring(2, 9);

    let client = clients.get(cleanDeviceId);
    if (!client) {
      client = {
        deviceId: cleanDeviceId,
        roomId: cleanRoomId,
        deviceType: deviceType || 'phone',
        deviceName: deviceName || (deviceType === 'laptop' ? 'Laptop Utama' : 'Smartphone Pengguna'),
        batteryLevel,
        isCharging,
        joinedAt: Date.now(),
        lastSeen: Date.now(),
      };
      clients.set(cleanDeviceId, client);
    } else {
      client.roomId = cleanRoomId;
      client.lastSeen = Date.now();
      if (deviceName) client.deviceName = deviceName;
      if (batteryLevel !== undefined) client.batteryLevel = batteryLevel;
      if (isCharging !== undefined) client.isCharging = isCharging;
    }

    const room = getOrCreateRoom(cleanRoomId);
    const roomDevices = Array.from(clients.values())
      .filter((c) => c.roomId === cleanRoomId && Date.now() - c.lastSeen < 60000)
      .map((c) => ({
        deviceId: c.deviceId,
        deviceType: c.deviceType,
        deviceName: c.deviceName,
        batteryLevel: c.batteryLevel,
        isCharging: c.isCharging,
        joinedAt: c.joinedAt,
      }));

    broadcastToRoom(
      cleanRoomId,
      {
        type: 'device_joined',
        device: {
          deviceId: cleanDeviceId,
          deviceType: client.deviceType,
          deviceName: client.deviceName,
          batteryLevel: client.batteryLevel,
          isCharging: client.isCharging,
          joinedAt: client.joinedAt,
        },
        devices: roomDevices,
      },
      cleanDeviceId
    );

    res.json({
      success: true,
      deviceId: cleanDeviceId,
      roomId: cleanRoomId,
      devices: roomDevices,
      files: room.files,
      clipboard: room.clipboard,
      notes: room.notes,
    });
  });

  // HTTP Action Relay Endpoint (Fallback when WebSockets are restricted)
  app.post('/api/action', (req, res) => {
    const { roomId, senderId, action } = req.body;
    if (!roomId || !action) return res.status(400).json({ error: 'Missing roomId or action' });

    const cleanRoomId = roomId.toUpperCase().trim();
    if (senderId && clients.has(senderId)) {
      clients.get(senderId)!.lastSeen = Date.now();
    }

    // Process specific state-mutating actions
    const room = getOrCreateRoom(cleanRoomId);

    if (action.type === 'clipboard_send' && action.text) {
      const clipItem: ClipboardItem = {
        id: 'clip_' + Math.random().toString(36).substring(2, 9),
        text: action.text,
        senderName: action.senderName || 'Device',
        senderType: action.senderType || 'phone',
        timestamp: Date.now(),
      };
      room.clipboard.unshift(clipItem);
      if (room.clipboard.length > 50) room.clipboard.pop();

      broadcastToRoom(cleanRoomId, {
        type: 'clipboard_received',
        item: clipItem,
      });
      return res.json({ success: true, item: clipItem });
    }

    if (action.type === 'notes_update') {
      room.notes = action.notes || '';
      broadcastToRoom(
        cleanRoomId,
        {
          type: 'notes_synced',
          notes: room.notes,
          updatedBy: senderId,
        },
        senderId
      );
      return res.json({ success: true, notes: room.notes });
    }

    // Forward all other action types (mouse, keyboard, media, presentation, camera, ping)
    broadcastToRoom(
      cleanRoomId,
      {
        ...action,
        senderId,
        timestamp: Date.now(),
      },
      senderId
    );

    res.json({ success: true });
  });

  // Server-Sent Events (SSE) stream for real-time fallback
  app.get('/api/events/:roomId/:deviceId', (req, res) => {
    const cleanRoomId = req.params.roomId.toUpperCase().trim();
    const cleanDeviceId = req.params.deviceId;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    let client = clients.get(cleanDeviceId);
    if (client) {
      client.sseRes = res;
      client.lastSeen = Date.now();
    }

    // Send initial connected ping
    res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`);

    const keepAlive = setInterval(() => {
      if (!res.writableEnded) {
        res.write(`: keepalive\n\n`);
        if (client) client.lastSeen = Date.now();
      }
    }, 15000);

    req.on('close', () => {
      clearInterval(keepAlive);
      if (client && client.sseRes === res) {
        client.sseRes = undefined;
      }
    });
  });

  // Polling sync endpoint
  app.get('/api/sync/:roomId', (req, res) => {
    const cleanRoomId = req.params.roomId.toUpperCase().trim();
    const since = parseInt(req.query.since as string) || 0;
    const room = rooms.get(cleanRoomId);

    const now = Date.now();
    const roomDevices = Array.from(clients.values())
      .filter((c) => c.roomId === cleanRoomId && now - c.lastSeen < 60000)
      .map((c) => ({
        deviceId: c.deviceId,
        deviceType: c.deviceType,
        deviceName: c.deviceName,
        batteryLevel: c.batteryLevel,
        isCharging: c.isCharging,
        joinedAt: c.joinedAt,
      }));

    const events = (room?.recentEvents || []).filter((e) => e.timestamp > since);

    res.json({
      roomId: cleanRoomId,
      devices: roomDevices,
      files: room?.files || [],
      clipboard: room?.clipboard || [],
      notes: room?.notes || '',
      events: events.map((e) => e.event),
      serverTime: now,
    });
  });

  // Direct File Upload endpoint (supports JSON base64Data)
  app.post('/api/upload', (req, res) => {
    try {
      const { roomId, name, size, type, senderName, senderType, base64Data } = req.body;
      if (!roomId || !name || !base64Data) {
        return res.status(400).json({ error: 'Missing required file data' });
      }

      const cleanRoomId = roomId.toUpperCase().trim();
      const fileId = 'file_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
      const base64Clean = base64Data.replace(/^data:[^;]+;base64,/, '');
      const buffer = Buffer.from(base64Clean, 'base64');

      const fileMeta: FileMetadata = {
        id: fileId,
        name: name || 'file.bin',
        size: size || buffer.length,
        type: type || 'application/octet-stream',
        senderName: senderName || 'Unknown Device',
        senderType: senderType || 'phone',
        timestamp: Date.now(),
        dataUrl: buffer.length < 5 * 1024 * 1024 ? base64Data : undefined,
      };

      fileStore.set(fileId, { meta: fileMeta, buffer });

      const room = getOrCreateRoom(cleanRoomId);
      room.files.unshift(fileMeta);
      if (room.files.length > 50) room.files.pop();

      broadcastToRoom(cleanRoomId, {
        type: 'file_received',
        file: fileMeta,
        downloadUrl: `/api/download/${fileId}`,
      });

      res.json({ success: true, file: fileMeta, downloadUrl: `/api/download/${fileId}` });
    } catch (err: any) {
      console.error('Upload error:', err);
      res.status(500).json({ error: 'Failed to upload file: ' + err.message });
    }
  });

  // Download File Endpoint
  app.get('/api/download/:fileId', (req, res) => {
    const { fileId } = req.params;
    const item = fileStore.get(fileId);
    if (!item) {
      return res.status(404).send('File tidak ditemukan atau telah kedaluwarsa');
    }

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(item.meta.name)}"`
    );
    res.setHeader('Content-Type', item.meta.type || 'application/octet-stream');
    res.setHeader('Content-Length', item.buffer.length);
    res.send(item.buffer);
  });

  // WebSocket Server Setup with explicit HTTP Upgrade Handler
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', (request, socket, head) => {
    try {
      const url = new URL(request.url || '', `http://${request.headers.host || 'localhost'}`);
      if (url.pathname === '/ws') {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
        });
      }
    } catch (e) {
      socket.destroy();
    }
  });

  wss.on('connection', (ws: WebSocket) => {
    let currentDeviceId: string | null = null;
    let currentRoomId: string | null = null;

    ws.on('message', (data: Buffer | string) => {
      try {
        const message = JSON.parse(data.toString());
        const { type } = message;

        switch (type) {
          case 'join': {
            const { roomId, deviceId, deviceType, deviceName, batteryLevel, isCharging } = message;
            currentDeviceId = deviceId || 'dev_' + Math.random().toString(36).substring(2, 9);
            currentRoomId = roomId.toUpperCase().trim();

            const clientInfo: ConnectedClient = {
              ws,
              deviceId: currentDeviceId,
              roomId: currentRoomId,
              deviceType: deviceType || 'phone',
              deviceName: deviceName || (deviceType === 'laptop' ? 'Laptop Utama' : 'Smartphone Pengguna'),
              batteryLevel,
              isCharging,
              joinedAt: Date.now(),
              lastSeen: Date.now(),
            };

            clients.set(currentDeviceId, clientInfo);
            const room = getOrCreateRoom(currentRoomId);

            const roomDevices = Array.from(clients.values())
              .filter((c) => c.roomId === currentRoomId && Date.now() - c.lastSeen < 60000)
              .map((c) => ({
                deviceId: c.deviceId,
                deviceType: c.deviceType,
                deviceName: c.deviceName,
                batteryLevel: c.batteryLevel,
                isCharging: c.isCharging,
                joinedAt: c.joinedAt,
              }));

            ws.send(
              JSON.stringify({
                type: 'joined_success',
                deviceId: currentDeviceId,
                roomId: currentRoomId,
                devices: roomDevices,
                files: room.files,
                clipboard: room.clipboard,
                notes: room.notes,
              })
            );

            broadcastToRoom(
              currentRoomId,
              {
                type: 'device_joined',
                device: {
                  deviceId: currentDeviceId,
                  deviceType: clientInfo.deviceType,
                  deviceName: clientInfo.deviceName,
                  batteryLevel: clientInfo.batteryLevel,
                  isCharging: clientInfo.isCharging,
                  joinedAt: clientInfo.joinedAt,
                },
                devices: roomDevices,
              },
              currentDeviceId
            );
            break;
          }

          case 'update_status': {
            if (currentDeviceId && clients.has(currentDeviceId)) {
              const client = clients.get(currentDeviceId)!;
              client.lastSeen = Date.now();
              if (message.batteryLevel !== undefined) client.batteryLevel = message.batteryLevel;
              if (message.isCharging !== undefined) client.isCharging = message.isCharging;
              if (message.deviceName) client.deviceName = message.deviceName;

              broadcastToRoom(
                client.roomId,
                {
                  type: 'device_updated',
                  device: {
                    deviceId: client.deviceId,
                    deviceType: client.deviceType,
                    deviceName: client.deviceName,
                    batteryLevel: client.batteryLevel,
                    isCharging: client.isCharging,
                  },
                },
                currentDeviceId
              );
            }
            break;
          }

          case 'mouse_move':
          case 'mouse_click':
          case 'mouse_scroll':
          case 'mouse_drag':
          case 'keyboard_input':
          case 'key_action':
          case 'media_control':
          case 'presentation_action':
          case 'laser_pointer':
          case 'ping_alert':
          case 'camera_frame':
          case 'camera_snapshot':
          case 'camera_control':
          case 'webrtc_signal': {
            if (currentRoomId) {
              if (currentDeviceId && clients.has(currentDeviceId)) {
                clients.get(currentDeviceId)!.lastSeen = Date.now();
              }
              broadcastToRoom(
                currentRoomId,
                {
                  ...message,
                  senderId: currentDeviceId,
                  timestamp: Date.now(),
                },
                currentDeviceId
              );
            }
            break;
          }

          case 'clipboard_send': {
            if (currentRoomId && message.text) {
              const room = getOrCreateRoom(currentRoomId);
              const clipItem: ClipboardItem = {
                id: 'clip_' + Math.random().toString(36).substring(2, 9),
                text: message.text,
                senderName: message.senderName || 'Device',
                senderType: message.senderType || 'phone',
                timestamp: Date.now(),
              };
              room.clipboard.unshift(clipItem);
              if (room.clipboard.length > 50) room.clipboard.pop();

              broadcastToRoom(currentRoomId, {
                type: 'clipboard_received',
                item: clipItem,
              });
            }
            break;
          }

          case 'notes_update': {
            if (currentRoomId) {
              const room = getOrCreateRoom(currentRoomId);
              room.notes = message.notes || '';
              broadcastToRoom(
                currentRoomId,
                {
                  type: 'notes_synced',
                  notes: room.notes,
                  updatedBy: currentDeviceId,
                },
                currentDeviceId
              );
            }
            break;
          }

          case 'ping': {
            if (currentDeviceId && clients.has(currentDeviceId)) {
              clients.get(currentDeviceId)!.lastSeen = Date.now();
            }
            ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
            break;
          }

          default:
            break;
        }
      } catch (err) {
        console.error('WS message error:', err);
      }
    });

    ws.on('close', () => {
      if (currentDeviceId && clients.has(currentDeviceId)) {
        const client = clients.get(currentDeviceId)!;
        const rId = client.roomId;
        clients.delete(currentDeviceId);

        const remainingDevices = Array.from(clients.values())
          .filter((c) => c.roomId === rId && Date.now() - c.lastSeen < 60000)
          .map((c) => ({
            deviceId: c.deviceId,
            deviceType: c.deviceType,
            deviceName: c.deviceName,
            batteryLevel: c.batteryLevel,
            isCharging: c.isCharging,
            joinedAt: c.joinedAt,
          }));

        broadcastToRoom(rId, {
          type: 'device_left',
          deviceId: currentDeviceId,
          devices: remainingDevices,
        });
      }
    });
  });

  // Periodic cleanup
  setInterval(() => {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    for (const [id, item] of fileStore.entries()) {
      if (item.meta.timestamp < oneHourAgo) {
        fileStore.delete(id);
      }
    }
  }, 15 * 60 * 1000);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`LinkBridge Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
