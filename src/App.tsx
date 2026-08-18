/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLinkBridge } from './hooks/useLinkBridge';
import { useBattery } from './hooks/useBattery';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PairingModal } from './components/PairingModal';
import { ApkInstallGuideModal } from './components/ApkInstallGuideModal';
import { LaptopDashboard } from './components/LaptopView/LaptopDashboard';
import { PhoneDashboard } from './components/PhoneView/PhoneDashboard';
import { SimulatorView } from './components/SimulatorView';
import { Language } from './utils/i18n';

export default function App() {
  const [isPairingOpen, setIsPairingOpen] = useState(false);
  const [isApkGuideOpen, setIsApkGuideOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('linkbridge_lang');
      if (saved === 'en' || saved === 'id' || saved === 'zh' || saved === 'vi') {
        return saved;
      }
    } catch (e) {
      // ignore
    }
    return 'en';
  });

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    try {
      localStorage.setItem('linkbridge_lang', lang);
    } catch (e) {
      // ignore
    }
  };

  const bridge = useLinkBridge();
  const battery = useBattery();

  // Send battery status to peers whenever it changes
  useEffect(() => {
    if (battery.isSupported && bridge.isConnected) {
      bridge.sendMessage({
        type: 'update_status',
        batteryLevel: battery.level,
        isCharging: battery.isCharging,
      });
    }
  }, [battery.level, battery.isCharging, bridge.isConnected]);

  // Handle Remote Trackpad Mouse Move
  const handleSendMouseMove = (dx: number, dy: number) => {
    bridge.sendMessage({
      type: 'mouse_move',
      dx,
      dy,
    });
  };

  // Handle Remote Mouse Click
  const handleSendMouseClick = (button: 'left' | 'right' | 'middle', isDown?: boolean) => {
    bridge.sendMessage({
      type: 'mouse_click',
      button,
      isDown,
    });
  };

  // Handle Remote Mouse Scroll
  const handleSendMouseScroll = (scrollX: number, scrollY: number) => {
    bridge.sendMessage({
      type: 'mouse_scroll',
      scrollX,
      scrollY,
    });
  };

  // Handle Remote Keyboard Input (text string)
  const handleSendKeyboardInput = (text: string) => {
    bridge.sendMessage({
      type: 'keyboard_input',
      text,
    });
  };

  // Handle Remote Key Action (Enter, Backspace, Ctrl shortcuts)
  const handleSendKeyAction = (key: string, modifiers?: any) => {
    bridge.sendMessage({
      type: 'key_action',
      key,
      modifiers,
    });
  };

  // Handle Media Control
  const handleSendMediaControl = (action: string) => {
    bridge.sendMessage({
      type: 'media_control',
      action,
    });
  };

  // Handle Presentation Slide Action & Laser Pointer
  const handleSendPresentationAction = (action: string, laserData?: any) => {
    if (action === 'laser' && laserData) {
      bridge.sendMessage({
        type: 'laser_pointer',
        x: laserData.x,
        y: laserData.y,
        active: laserData.active,
      });
    } else {
      bridge.sendMessage({
        type: 'presentation_action',
        action,
      });
    }
  };

  // Handle Camera Frame Streaming
  const handleSendCameraFrame = (frameData: string) => {
    bridge.sendMessage({
      type: 'camera_frame',
      frameData,
    });
  };

  // Handle Camera Control Actions
  const handleSendCameraControl = (action: string) => {
    bridge.sendMessage({
      type: 'camera_control',
      action,
    });
  };

  const commonLaptopProps = {
    roomId: bridge.roomId,
    peerDevices: bridge.peerDevices,
    files: bridge.files,
    onUploadFile: bridge.uploadFile,
    uploadProgress: bridge.uploadProgress,
    clipboard: bridge.clipboard,
    onSendClipboard: bridge.sendClipboard,
    notes: bridge.notes,
    onUpdateNotes: bridge.updateNotes,
    remoteMouse: bridge.remoteMouse,
    presentationState: bridge.presentationState,
    onSendSlideAction: (act: any) => handleSendPresentationAction(act),
    cameraFrame: bridge.cameraFrame,
    cameraActive: bridge.cameraActive,
    onSendCameraControl: handleSendCameraControl,
    onOpenPairing: () => setIsPairingOpen(true),
    onOpenApkGuide: () => setIsApkGuideOpen(true),
    onPingPeers: bridge.sendPingAlert,
    currentLang,
  };

  const commonPhoneProps = {
    roomId: bridge.roomId,
    onChangeRoom: bridge.changeRoom,
    peerDevices: bridge.peerDevices,
    files: bridge.files,
    onUploadFile: bridge.uploadFile,
    uploadProgress: bridge.uploadProgress,
    clipboard: bridge.clipboard,
    onSendClipboard: bridge.sendClipboard,
    notes: bridge.notes,
    onUpdateNotes: bridge.updateNotes,
    onSendMouseMove: handleSendMouseMove,
    onSendMouseClick: handleSendMouseClick,
    onSendMouseScroll: handleSendMouseScroll,
    onSendKeyboardInput: handleSendKeyboardInput,
    onSendKeyAction: handleSendKeyAction,
    onSendMediaControl: handleSendMediaControl,
    onSendPresentationAction: handleSendPresentationAction,
    onSendCameraFrame: handleSendCameraFrame,
    onSendCameraControl: handleSendCameraControl,
    onOpenPairing: () => setIsPairingOpen(true),
    onOpenApkGuide: () => setIsApkGuideOpen(true),
    onPingPeers: bridge.sendPingAlert,
    isAlerting: bridge.isAlerting,
    currentLang,
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Global Header */}
      <Header
        role={bridge.role}
        onRoleChange={bridge.changeRole}
        roomId={bridge.roomId}
        isConnected={bridge.isConnected}
        latency={bridge.latency}
        devices={bridge.devices}
        peerDevices={bridge.peerDevices}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        onOpenPairing={() => setIsPairingOpen(true)}
        onOpenApkGuide={() => setIsApkGuideOpen(true)}
        onPingPeers={bridge.sendPingAlert}
      />

      {/* Main Viewport Content based on Role */}
      <main className="flex-1">
        {bridge.role === 'laptop' && <LaptopDashboard {...commonLaptopProps} />}

        {bridge.role === 'phone' && <PhoneDashboard {...commonPhoneProps} />}

        {bridge.role === 'simulator' && (
          <SimulatorView
            laptopProps={commonLaptopProps}
            phoneProps={commonPhoneProps}
            currentLang={currentLang}
          />
        )}
      </main>

      {/* Footer with SASAM Copyright */}
      <Footer currentLang={currentLang} />

      {/* Pairing / QR Code Modal */}
      <PairingModal
        isOpen={isPairingOpen}
        onClose={() => setIsPairingOpen(false)}
        roomId={bridge.roomId}
        shareUrl={bridge.shareUrl}
        currentLang={currentLang}
        onChangeRoom={bridge.changeRoom}
        onSwitchToPhone={() => bridge.changeRole('phone')}
      />

      {/* APK & PWA Installation Guide Modal */}
      <ApkInstallGuideModal
        isOpen={isApkGuideOpen}
        onClose={() => setIsApkGuideOpen(false)}
        currentLang={currentLang}
      />
    </div>
  );
}
