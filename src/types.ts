export type DeviceType = 'laptop' | 'phone' | 'simulator';

export interface DeviceInfo {
  deviceId: string;
  deviceType: DeviceType;
  deviceName: string;
  batteryLevel?: number;
  isCharging?: boolean;
  joinedAt?: number;
}

export interface FileTransferItem {
  id: string;
  name: string;
  size: number;
  type: string;
  senderName: string;
  senderType: string;
  timestamp: number;
  dataUrl?: string;
  downloadUrl?: string;
  progress?: number;
}

export interface ClipboardItem {
  id: string;
  text: string;
  senderName: string;
  senderType: DeviceType;
  timestamp: number;
}

export interface MouseEventPayload {
  type: 'mouse_move' | 'mouse_click' | 'mouse_scroll' | 'mouse_drag';
  dx?: number;
  dy?: number;
  button?: 'left' | 'right' | 'middle';
  scrollX?: number;
  scrollY?: number;
  isDown?: boolean;
  absoluteX?: number;
  absoluteY?: number;
}

export interface KeyboardEventPayload {
  type: 'keyboard_input' | 'key_action';
  key?: string;
  text?: string;
  modifiers?: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
  };
}

export interface MediaEventPayload {
  type: 'media_control';
  action: 'play_pause' | 'volume_up' | 'volume_down' | 'mute' | 'next' | 'previous' | 'fullscreen';
}

export interface PresentationEventPayload {
  type: 'presentation_action';
  action: 'next' | 'prev' | 'first' | 'last' | 'blank' | 'laser';
  laserX?: number;
  laserY?: number;
  laserActive?: boolean;
}

export interface CameraEventPayload {
  type: 'camera_frame' | 'camera_snapshot' | 'camera_control';
  frameData?: string;
  action?: 'start' | 'stop' | 'toggle_flash' | 'flip_camera';
}

export type ActiveTab = 'files' | 'clipboard' | 'trackpad' | 'camera' | 'presentation' | 'notes';
