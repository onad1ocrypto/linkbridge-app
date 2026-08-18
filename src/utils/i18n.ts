export type Language = 'en' | 'id' | 'zh' | 'vi';

export interface Translations {
  appName: string;
  tagline: string;
  laptopMode: string;
  phoneMode: string;
  simulatorMode: string;
  pairingCode: string;
  connectPhone: string;
  installApk: string;
  ringPhone: string;
  connected: string;
  disconnected: string;
  waitingForLaptop: string;
  waitingForPhone: string;
  latency: string;
  device: string;
  room: string;
  copyright: string;
  activeStatus: string;
  copied: string;
  copy: string;
  share: string;
  close: string;
  gotIt: string;

  // Tabs
  tabFiles: string;
  tabClipboard: string;
  tabTrackpad: string;
  tabPresentation: string;
  tabCamera: string;
  tabKeyboard: string;

  // Files
  dragDropFiles: string;
  browseFiles: string;
  transferHistory: string;
  autoSync: string;
  noFilesYet: string;
  sendToPhone: string;
  sendToLaptop: string;
  takePhotoSend: string;
  galleryDocs: string;
  download: string;
  sendingToLaptop: string;
  readyForDownload: string;
  clearHistory: string;

  // Clipboard & Notes
  sendToClipboard: string;
  pasteFromDevice: string;
  sharedNotes: string;
  sharedNotesDesc: string;
  clipboardHistory: string;
  noClipboardYet: string;
  notesPlaceholder: string;
  inputPlaceholder: string;
  send: string;
  quickPaste: string;
  copyAll: string;

  // Trackpad
  trackpadTitle: string;
  trackpadGuide: string;
  touchpadArea: string;
  leftClick: string;
  rightClick: string;
  scroll: string;
  mouseTestArea: string;
  mouseTestDesc: string;
  cursorPos: string;
  sensitivity: string;
  dragLock: string;
  dragLocked: string;
  smoothSens: string;
  normalSens: string;
  fastSens: string;
  highSens: string;
  osCursorPrompt: string;
  activateOsAgent: string;

  // Keyboard & Media
  liveTextInput: string;
  typePlaceholder: string;
  mediaControls: string;
  mediaDesc: string;
  volUp: string;
  volDown: string;
  mute: string;
  fullscreen: string;
  prev: string;
  next: string;
  play: string;
  pause: string;
  shortcutsTitle: string;
  enter: string;
  backspace: string;
  space: string;
  mediaPlayerSim: string;
  mediaPlayerDesc: string;
  liveTypingReceiver: string;
  liveTypingDesc: string;
  copyIncomingText: string;
  waitingForTyping: string;

  // Presentation
  presentationTimer: string;
  slidePrev: string;
  slideNext: string;
  virtualLaser: string;
  laserDesc: string;
  laserTouchHint: string;
  activeSlide: string;
  presentationViewerTitle: string;
  presentationViewerDesc: string;
  fullSlideMode: string;

  // Camera
  cameraTitle: string;
  cameraDesc: string;
  startStreaming: string;
  stopStreaming: string;
  takeSnapshot: string;
  flipCamera: string;
  streamingLive: string;
  snapshotSent: string;
  cameraViewerTitle: string;
  cameraViewerDesc: string;
  cameraOffline: string;

  // Pairing Modal
  scanQrTitle: string;
  scanQrSubtitle: string;
  scanInstruction: string;
  roomPinLabel: string;
  copyPhoneLink: string;
  linkCopied: string;
  pairingNote: string;
  customPinLabel: string;
  apply: string;
  generateNew: string;
  testInBrowser: string;
  openPhoneMode: string;
  enterRoomPin: string;
  connect: string;
  syncPin: string;
  laptopNotConnected: string;
  tapToSyncPin: string;

  // PWA / APK Tutorial
  installTitle: string;
  installSubtitle: string;
  androidStep1: string;
  androidStep2: string;
  androidStep3: string;
  iosStep1: string;
  iosStep2: string;
  oneClickInstall: string;
  oneClickDesc: string;
  installNow: string;

  // Native OS Agent Modal
  osAgentTitle: string;
  osAgentSubtitle: string;
  whySandboxTitle: string;
  whySandboxDesc: string;
  solutionTitle: string;
  solutionDesc: string;
  quickStepsTitle: string;
  agentStep1Title: string;
  agentStep2Title: string;
  agentStep2Desc: string;
  agentStep3Title: string;
  agentStep3Success: string;
  scriptCodeTitle: string;
  downloadScript: string;
  copyCode: string;

  // Simulator
  simulatorInfo: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'LinkBridge',
    tagline: 'Cross-Device Connectivity',
    laptopMode: 'Laptop View',
    phoneMode: 'Phone View',
    simulatorMode: 'Simulator',
    pairingCode: 'Pairing PIN',
    connectPhone: 'Connect Phone',
    installApk: 'Install APK',
    ringPhone: 'Ring Phone',
    connected: 'Connected',
    disconnected: 'Disconnected',
    waitingForLaptop: 'Waiting for Laptop...',
    waitingForPhone: 'Waiting for Phone...',
    latency: 'Latency',
    device: 'Device',
    room: 'Room',
    copyright: '© 2026 SASAM. All rights reserved.',
    activeStatus: 'ACTIVE',
    copied: 'Copied!',
    copy: 'Copy',
    share: 'Share',
    close: 'Close',
    gotIt: 'Got It',

    tabFiles: 'Files',
    tabClipboard: 'Clipboard & Notes',
    tabTrackpad: 'Trackpad',
    tabPresentation: 'Presentation',
    tabCamera: 'Camera Stream',
    tabKeyboard: 'Type & Media',

    dragDropFiles: 'Drag & Drop files here, or click to browse',
    browseFiles: 'Browse Files',
    transferHistory: 'Transfer History',
    autoSync: 'Auto Synced',
    noFilesYet: 'No files transferred yet. Click above to send files.',
    sendToPhone: 'Send to Phone',
    sendToLaptop: 'Send File / Photo',
    takePhotoSend: 'Capture & Send',
    galleryDocs: 'Gallery & Documents',
    download: 'Download',
    sendingToLaptop: 'Sending to Laptop...',
    readyForDownload: 'Ready for download',
    clearHistory: 'Clear History',

    sendToClipboard: 'Send to Laptop Clipboard',
    pasteFromDevice: 'Paste from Device',
    sharedNotes: 'Collaborative Real-time Notes',
    sharedNotesDesc: 'Synchronized with all paired devices',
    clipboardHistory: 'Clipboard Feed',
    noClipboardYet: 'No clipboard items yet. Type above to sync.',
    notesPlaceholder: 'Type collaborative notes here...',
    inputPlaceholder: 'Type or paste text/URL...',
    send: 'Send',
    quickPaste: 'Quick Paste',
    copyAll: 'Copy All',

    trackpadTitle: 'Wireless Trackpad',
    trackpadGuide: '1 Finger: Move • Tap: Click • 2 Fingers: Right Click • Right Bar: Scroll',
    touchpadArea: 'Slide fingers here to move cursor',
    leftClick: 'Left Click',
    rightClick: 'Right Click',
    scroll: 'Scroll',
    mouseTestArea: 'Interactive Cursor & Scroll Canvas',
    mouseTestDesc: 'Move your finger on your phone touchpad to test real-time cursor response',
    cursorPos: 'Cursor Position',
    sensitivity: 'Sensitivity',
    dragLock: 'Drag',
    dragLocked: 'Drag Locked',
    smoothSens: 'Smooth (0.5x)',
    normalSens: 'Normal (0.8x)',
    fastSens: 'Fast (1.2x)',
    highSens: 'High (1.6x)',
    osCursorPrompt: 'Want to control the real OS cursor across entire Windows/Mac (Games, PPT, Desktop)?',
    activateOsAgent: 'Activate Native OS Agent',

    liveTextInput: 'Send Live Text to Laptop',
    typePlaceholder: 'Type text here then press send...',
    mediaControls: 'Media & Volume Control',
    mediaDesc: 'YouTube / Video Players',
    volUp: 'Vol +',
    volDown: 'Vol -',
    mute: 'Mute Audio',
    fullscreen: 'Fullscreen (F)',
    prev: 'Prev',
    next: 'Next',
    play: 'Play',
    pause: 'Pause',
    shortcutsTitle: 'Navigation & Shortcuts',
    enter: 'Enter',
    backspace: 'Delete',
    space: 'Space',
    mediaPlayerSim: 'Interactive Media Player Simulation',
    mediaPlayerDesc: 'Reacts live to media commands sent from smartphone',
    liveTypingReceiver: 'Live Typing Stream Receiver',
    liveTypingDesc: 'Real-time text streaming receiver from smartphone keyboard',
    copyIncomingText: 'Copy Incoming Text',
    waitingForTyping: 'Waiting for incoming typing from phone...',

    presentationTimer: 'Presentation Timer',
    slidePrev: 'Previous Slide',
    slideNext: 'Next Slide',
    virtualLaser: 'Virtual Laser Pointer',
    laserDesc: 'Touch and drag to highlight points on laptop screen',
    laserTouchHint: 'Hold & drag here to project laser pointer on laptop screen',
    activeSlide: 'Current Slide',
    presentationViewerTitle: 'Presentation Slide Projector',
    presentationViewerDesc: 'Remotely advance slides and project virtual laser pointer from phone',
    fullSlideMode: 'Fullscreen Presentation',

    cameraTitle: 'Wireless Phone Camera',
    cameraDesc: 'Stream live video from smartphone camera for document scanning or wireless webcam',
    startStreaming: 'Start Camera Stream',
    stopStreaming: 'Stop Camera',
    takeSnapshot: 'Take & Send Photo',
    flipCamera: 'Flip Camera',
    streamingLive: 'STREAMING TO LAPTOP',
    snapshotSent: 'Photo Sent to Laptop!',
    cameraViewerTitle: 'Live Wireless Camera Feed',
    cameraViewerDesc: 'Real-time video feed streamed wirelessly from smartphone camera',
    cameraOffline: 'Camera is currently offline. Press Start Camera on phone.',

    scanQrTitle: 'Connect Phone to Laptop',
    scanQrSubtitle: 'Scan QR code with smartphone camera or enter room PIN',
    scanInstruction: 'Scan with Smartphone Camera / Google Lens / Chrome',
    roomPinLabel: 'Room Pairing PIN:',
    copyPhoneLink: 'Copy Phone Link',
    linkCopied: 'Copied!',
    pairingNote: 'If camera scan does not open directly: open browser on phone, visit this app URL, then enter the PIN above.',
    customPinLabel: 'Custom Room PIN:',
    apply: 'Apply',
    generateNew: 'Generate Random',
    testInBrowser: 'Test directly in this browser:',
    openPhoneMode: 'Open Phone View',
    enterRoomPin: 'Enter Laptop Room PIN:',
    connect: 'Connect',
    syncPin: 'Sync PIN',
    laptopNotConnected: 'Laptop Not Connected',
    tapToSyncPin: 'Tap here to match PIN code with laptop screen',

    installTitle: 'Install as Native Mobile APK',
    installSubtitle: 'PWA WebAPK technology allows running fullscreen like a native Android/iOS app',
    androidStep1: 'Open this app in Google Chrome on your Android smartphone.',
    androidStep2: 'Tap the three-dots menu (⋮) in the top right corner.',
    androidStep3: 'Select "Install app" or "Add to Home Screen".',
    iosStep1: 'Open in Safari on iPhone / iPad.',
    iosStep2: 'Tap the Share button (box with upward arrow) and select "Add to Home Screen".',
    oneClickInstall: 'One-Click Direct Install Ready',
    oneClickDesc: 'Install LinkBridge directly to your phone menu',
    installNow: 'Install Now',

    osAgentTitle: 'Native OS Remote Mouse Companion',
    osAgentSubtitle: 'Control real Windows / macOS / Linux cursor across all apps',
    whySandboxTitle: 'Why do browsers restrict cursor movement?',
    whySandboxDesc: 'For user security, standard web browsers (Chrome, Edge, Safari) prohibit websites from controlling the physical OS mouse cursor outside the browser tab.',
    solutionTitle: 'The Solution: 1-File Lightweight Native Companion Agent',
    solutionDesc: 'Run this tiny helper script on your laptop. Your phone will instantly control the real OS mouse, keyboard, and volume across all desktop apps (PowerPoint, Games, File Explorer)!',
    quickStepsTitle: 'Quick 1-Minute Setup:',
    agentStep1Title: '1. Install Python dependencies on laptop:',
    agentStep2Title: '2. Download Companion Script for Room',
    agentStep2Desc: 'The script is pre-configured with your room pairing PIN',
    agentStep3Title: '3. Run script on laptop terminal:',
    agentStep3Success: 'Done! Move your finger on phone trackpad to control real OS cursor everywhere!',
    scriptCodeTitle: 'Python Companion Script (Pre-configured for Room):',
    downloadScript: 'Download .py',
    copyCode: 'Copy Code',

    simulatorInfo: 'Simulator Mode: Test real-time cross-device interactions side-by-side on a single screen!',
  },

  id: {
    appName: 'LinkBridge',
    tagline: 'Konektivitas Antar Perangkat',
    laptopMode: 'Tampilan Laptop',
    phoneMode: 'Tampilan HP',
    simulatorMode: 'Simulasi',
    pairingCode: 'PIN Pairing',
    connectPhone: 'Hubungkan HP',
    installApk: 'Pasang APK',
    ringPhone: 'Bunyikan HP',
    connected: 'Tersambung',
    disconnected: 'Terputus',
    waitingForLaptop: 'Menunggu Laptop...',
    waitingForPhone: 'Menunggu HP...',
    latency: 'Latensi',
    device: 'Perangkat',
    room: 'Ruangan',
    copyright: '© 2026 SASAM. Hak cipta dilindungi undang-undang.',
    activeStatus: 'AKTIF',
    copied: 'Tersalin!',
    copy: 'Salin',
    share: 'Bagikan',
    close: 'Tutup',
    gotIt: 'Mengerti',

    tabFiles: 'File',
    tabClipboard: 'Clipboard & Catatan',
    tabTrackpad: 'Trackpad',
    tabPresentation: 'Presentasi',
    tabCamera: 'Kamera HP',
    tabKeyboard: 'Ketik & Media',

    dragDropFiles: 'Tarik & lepas file di sini, atau klik untuk memilih',
    browseFiles: 'Pilih File',
    transferHistory: 'Riwayat Transfer',
    autoSync: 'Auto Sinkron',
    noFilesYet: 'Belum ada file yang terkirim. Klik tombol di atas untuk mengirim file.',
    sendToPhone: 'Kirim ke HP',
    sendToLaptop: 'Kirim File / Foto',
    takePhotoSend: 'Foto & Kirim Langsung',
    galleryDocs: 'Galeri & Dokumen',
    download: 'Unduh',
    sendingToLaptop: 'Mengirim ke Laptop...',
    readyForDownload: 'Siap diunduh',
    clearHistory: 'Hapus Riwayat',

    sendToClipboard: 'Kirim ke Clipboard Laptop',
    pasteFromDevice: 'Tempel dari Perangkat',
    sharedNotes: 'Catatan Bersama Real-Time',
    sharedNotesDesc: 'Tersinkron dengan semua perangkat terhubung',
    clipboardHistory: 'Riwayat Clipboard',
    noClipboardYet: 'Belum ada riwayat clipboard. Ketik di atas untuk sinkronisasi.',
    notesPlaceholder: 'Ketik catatan bersama di sini...',
    inputPlaceholder: 'Ketik atau tempel teks/link...',
    send: 'Kirim',
    quickPaste: 'Tempel Cepat',
    copyAll: 'Salin Semua',

    trackpadTitle: 'Touchpad Nirkabel',
    trackpadGuide: '1 Jari: Gerak • Tap: Klik • 2 Jari: Klik Kanan • Bilah Kanan: Scroll',
    touchpadArea: 'Geser jari di sini untuk mengarahkan kursor',
    leftClick: 'Klik Kiri',
    rightClick: 'Klik Kanan',
    scroll: 'Scroll',
    mouseTestArea: 'Kanvas Uji Kursor & Scroll Interaktif',
    mouseTestDesc: 'Gerakkan jari pada touchpad HP Anda untuk melihat pergerakan kursor secara langsung',
    cursorPos: 'Posisi Kursor',
    sensitivity: 'Kecepatan Kursor (Sensitivitas)',
    dragLock: 'Drag',
    dragLocked: 'Drag Terkunci',
    smoothSens: 'Halus (0.5x)',
    normalSens: 'Normal (0.8x)',
    fastSens: 'Cepat (1.2x)',
    highSens: 'Tinggi (1.6x)',
    osCursorPrompt: 'Ingin mengontrol kursor fisik OS di seluruh Windows/Mac (Game, PPT, Desktop)?',
    activateOsAgent: 'Aktifkan Native OS Agent',

    liveTextInput: 'Kirim Teks Langsung ke Laptop',
    typePlaceholder: 'Ketik teks di sini lalu kirim...',
    mediaControls: 'Kontrol Media & Volume',
    mediaDesc: 'YouTube / Video Player',
    volUp: 'Vol +',
    volDown: 'Vol -',
    mute: 'Mute Suara',
    fullscreen: 'Layar Penuh (F)',
    prev: 'Sebelumnya',
    next: 'Selanjutnya',
    play: 'Putar',
    pause: 'Jeda',
    shortcutsTitle: 'Tombol Pintas & Navigasi',
    enter: 'Enter',
    backspace: 'Hapus',
    space: 'Spasi',
    mediaPlayerSim: 'Simulasi Pemutar Media Interaktif',
    mediaPlayerDesc: 'Merespons langsung perintah tombol media dari smartphone',
    liveTypingReceiver: 'Terminal Penerima Ketikan Live',
    liveTypingDesc: 'Menerima aliran ketikan teks secara real-time dari keyboard smartphone',
    copyIncomingText: 'Salin Teks Masuk',
    waitingForTyping: 'Menunggu ketikan teks dari HP...',

    presentationTimer: 'Pengatur Waktu Presentasi',
    slidePrev: 'Slide Sebelumnya',
    slideNext: 'Slide Berikutnya',
    virtualLaser: 'Virtual Laser Pointer',
    laserDesc: 'Sentuh & geser untuk menyorot bagian di layar laptop',
    laserTouchHint: 'Tahan & geser jari di sini untuk menyalakan laser merah di layar laptop',
    activeSlide: 'Slide Saat Ini',
    presentationViewerTitle: 'Proyektor Slide Presentasi',
    presentationViewerDesc: 'Ganti slide dan gunakan laser pointer jarak jauh dari HP',
    fullSlideMode: 'Presentasi Layar Penuh',

    cameraTitle: 'Kamera Nirkabel HP',
    cameraDesc: 'Streaming video langsung dari kamera HP untuk pemindai dokumen atau webcam nirkabel',
    startStreaming: 'Mulai Streaming Kamera',
    stopStreaming: 'Hentikan Kamera',
    takeSnapshot: 'Ambil & Kirim Foto',
    flipCamera: 'Balik Kamera',
    streamingLive: 'STREAMING KE LAPTOP',
    snapshotSent: 'Foto Terkirim ke Laptop!',
    cameraViewerTitle: 'Penampil Kamera Nirkabel Live',
    cameraViewerDesc: 'Aliran video real-time yang ditransmisikan secara nirkabel dari kamera HP',
    cameraOffline: 'Kamera sedang offline. Tekan Mulai Streaming di HP.',

    scanQrTitle: 'Hubungkan HP ke Laptop',
    scanQrSubtitle: 'Scan QR code dengan kamera HP atau masukkan PIN ruangan',
    scanInstruction: 'Scan via Kamera HP / Google Lens / Browser Chrome',
    roomPinLabel: 'Kode Pairing Ruangan (PIN):',
    copyPhoneLink: 'Salin Link HP',
    linkCopied: 'Tersalin!',
    pairingNote: 'Jika scan kamera tidak membuka link secara otomatis: buka browser di HP, kunjungi tautan web ini lalu masukkan PIN di atas.',
    customPinLabel: 'Ganti / Buat Kode PIN Sendiri:',
    apply: 'Terapkan',
    generateNew: 'Acak Kode Baru',
    testInBrowser: 'Uji langsung di browser ini:',
    openPhoneMode: 'Buka Mode HP',
    enterRoomPin: 'Masukkan PIN / Kode Ruangan Laptop:',
    connect: 'Hubungkan',
    syncPin: 'Samakan PIN',
    laptopNotConnected: 'Laptop Belum Terhubung',
    tapToSyncPin: 'Ketuk di sini untuk menyamakan Kode PIN dengan layar laptop',

    installTitle: 'Pasang sebagai Aplikasi APK di HP',
    installSubtitle: 'Teknologi PWA WebAPK memungkinkan aplikasi berjalan fullscreen seperti aplikasi native',
    androidStep1: 'Buka web app ini di browser Google Chrome pada smartphone Android Anda.',
    androidStep2: 'Ketuk menu titik tiga (⋮) di pojok kanan atas browser.',
    androidStep3: 'Pilih "Install aplikasi" atau "Tambahkan ke Layar Utama".',
    iosStep1: 'Buka di browser Safari pada iPhone / iPad.',
    iosStep2: 'Ketuk tombol Bagikan (ikon kotak panah ke atas) lalu pilih "Tambahkan ke Layar Utama".',
    oneClickInstall: 'Instalasi 1-Klik Langsung Siap',
    oneClickDesc: 'Pasang LinkBridge langsung ke menu aplikasi ponsel Anda',
    installNow: 'Pasang Sekarang',

    osAgentTitle: 'Native OS Remote Mouse Companion',
    osAgentSubtitle: 'Kontrol Kursor Fisik OS di Seluruh Layar Laptop (Windows / Mac / Linux)',
    whySandboxTitle: 'Mengapa Browser Membatasi Kursor di Dalam Tab?',
    whySandboxDesc: 'Demi keamanan pengguna, semua browser web di dunia (Chrome, Edge, Safari) melarang website menggerakkan kursor asli sistem operasi di luar tab web.',
    solutionTitle: 'Solusi: Script Pembantu Ringan 1-File',
    solutionDesc: 'Jalankan script pembantu ringan ini di laptop. HP Anda akan langsung menggerakkan kursor asli, mengetik keyboard, dan mengatur volume di semua aplikasi desktop (PowerPoint, Game, File Explorer)!',
    quickStepsTitle: 'Langkah Cepat (1 Menit):',
    agentStep1Title: '1. Install library Python di laptop Anda:',
    agentStep2Title: '2. Download Script Companion untuk Room',
    agentStep2Desc: 'File script sudah otomatis diatur sesuai PIN Room Anda',
    agentStep3Title: '3. Jalankan script di terminal laptop:',
    agentStep3Success: 'Selesai! Gerakkan kursor di HP, kursor laptop fisik akan langsung bergerak di seluruh komputer!',
    scriptCodeTitle: 'Kode Script Python (Otomatis Sesuai Room):',
    downloadScript: 'Download .py',
    copyCode: 'Salin Kode',

    simulatorInfo: 'Mode Simulasi: Uji interaksi lintas perangkat Laptop (kiri) & HP (kanan) secara berdampingan dalam 1 layar!',
  },

  zh: {
    appName: 'LinkBridge',
    tagline: '跨设备互联生态',
    laptopMode: '电脑端',
    phoneMode: '手机端',
    simulatorMode: '模拟器',
    pairingCode: '配对 PIN 码',
    connectPhone: '连接手机',
    installApk: '安装应用 (APK)',
    ringPhone: '响铃寻找手机',
    connected: '已连接',
    disconnected: '未连接',
    waitingForLaptop: '等待电脑连接...',
    waitingForPhone: '等待手机连接...',
    latency: '延迟',
    device: '设备',
    room: '房间',
    copyright: '© 2026 SASAM. 版权所有 保留所有权利。',
    activeStatus: '运行中',
    copied: '已复制！',
    copy: '复制',
    share: '分享',
    close: '关闭',
    gotIt: '知道了',

    tabFiles: '文件传输',
    tabClipboard: '剪贴板与笔记',
    tabTrackpad: '触控板',
    tabPresentation: '演示遥控',
    tabCamera: '无线摄像头',
    tabKeyboard: '键盘与媒体',

    dragDropFiles: '拖放文件到此处，或点击浏览',
    browseFiles: '浏览文件',
    transferHistory: '传输记录',
    autoSync: '自动同步',
    noFilesYet: '暂无文件传输。点击上方按钮发送。',
    sendToPhone: '发送到手机',
    sendToLaptop: '发送文件 / 照片',
    takePhotoSend: '拍照即传',
    galleryDocs: '相册与文档',
    download: '下载',
    sendingToLaptop: '正在发送至电脑...',
    readyForDownload: '可供下载',
    clearHistory: '清空历史',

    sendToClipboard: '发送至电脑剪贴板',
    pasteFromDevice: '从设备粘贴',
    sharedNotes: '实时协同笔记',
    sharedNotesDesc: '在所有配对设备间即时同步',
    clipboardHistory: '剪贴板历史',
    noClipboardYet: '暂无剪贴板记录。在上方输入即可同步。',
    notesPlaceholder: '在此输入协同笔记...',
    inputPlaceholder: '输入或粘贴文本/网址...',
    send: '发送',
    quickPaste: '快速粘贴',
    copyAll: '全部复制',

    trackpadTitle: '无线触控板',
    trackpadGuide: '单指: 移动 • 点击: 左键 • 双指: 右键 • 右侧条: 滚动',
    touchpadArea: '在此区域滑动控制光标',
    leftClick: '左键点击',
    rightClick: '右键点击',
    scroll: '滚动',
    mouseTestArea: '实时光标与滚动画布',
    mouseTestDesc: '在手机触控板上滑动以测试电脑端的实时光标响应',
    cursorPos: '光标坐标',
    sensitivity: '光标灵敏度',
    dragLock: '拖动锁定',
    dragLocked: '已锁定拖动',
    smoothSens: '平滑 (0.5x)',
    normalSens: '标准 (0.8x)',
    fastSens: '快速 (1.2x)',
    highSens: '极速 (1.6x)',
    osCursorPrompt: '想要在整个电脑系统 (游戏、PPT、桌面) 中控制真实鼠标？',
    activateOsAgent: '启动本地系统代理',

    liveTextInput: '实时文字输入至电脑',
    typePlaceholder: '在此输入文字并发送...',
    mediaControls: '媒体与音量控制',
    mediaDesc: 'YouTube / 视频播放器',
    volUp: '音量 +',
    volDown: '音量 -',
    mute: '静音',
    fullscreen: '全屏 (F)',
    prev: '上一首',
    next: '下一首',
    play: '播放',
    pause: '暂停',
    shortcutsTitle: '快捷键与导航',
    enter: '回车',
    backspace: '删除',
    space: '空格',
    mediaPlayerSim: '交互式媒体播放器模拟',
    mediaPlayerDesc: '实时响应手机发送的媒体控制指令',
    liveTypingReceiver: '实时键盘文字接收器',
    liveTypingDesc: '即时显示来自手机键盘输入的文字流',
    copyIncomingText: '复制接收文本',
    waitingForTyping: '等待来自手机的键盘输入...',

    presentationTimer: '演示计时器',
    slidePrev: '上一页幻灯片',
    slideNext: '下一页幻灯片',
    virtualLaser: '虚拟激光笔',
    laserDesc: '触摸并拖动以在电脑屏幕上投射红点激光',
    laserTouchHint: '按住并在区域内滑动，电脑屏幕将同步显示红点激光',
    activeSlide: '当前幻灯片',
    presentationViewerTitle: '演示幻灯片投影',
    presentationViewerDesc: '使用手机远程控制翻页与激光指示',
    fullSlideMode: '全屏演示模式',

    cameraTitle: '无线手机摄像头',
    cameraDesc: '将手机作为无线摄像头进行实时视频传输或扫描文档',
    startStreaming: '开启摄像头传输',
    stopStreaming: '停止摄像头',
    takeSnapshot: '拍照并发送',
    flipCamera: '翻转摄像头',
    streamingLive: '正在向电脑推流',
    snapshotSent: '照片已发送至电脑！',
    cameraViewerTitle: '无线摄像头实时画面',
    cameraViewerDesc: '从智能手机无线传输的实时超清画面',
    cameraOffline: '摄像头未开启。请在手机端点击开启摄像头。',

    scanQrTitle: '连接手机与电脑',
    scanQrSubtitle: '使用手机相机扫描二维码或输入配对 PIN 码',
    scanInstruction: '请使用手机相机 / 微信扫一扫 / 浏览器扫描',
    roomPinLabel: '房间配对 PIN 码:',
    copyPhoneLink: '复制手机端链接',
    linkCopied: '已复制！',
    pairingNote: '如果扫码未能直接打开：请在手机浏览器中访问此网址，并输入上方的 PIN 码。',
    customPinLabel: '自定义房间 PIN 码:',
    apply: '应用',
    generateNew: '随机生成',
    testInBrowser: '在当前浏览器中直接测试:',
    openPhoneMode: '打开手机模式',
    enterRoomPin: '输入电脑端配对 PIN 码:',
    connect: '立即连接',
    syncPin: '同步 PIN 码',
    laptopNotConnected: '未连接到电脑',
    tapToSyncPin: '点击此处与电脑端屏幕 PIN 码保持同步',

    installTitle: '安装为手机独立应用 (APK)',
    installSubtitle: 'PWA WebAPK 技术支持全屏独立运行，体验与原生 App 一致',
    androidStep1: '在 Android 手机上使用 Google Chrome 浏览器打开本应用。',
    androidStep2: '点击浏览器右上角的三点菜单 (⋮)。',
    androidStep3: '选择 “安装应用” 或 “添加到主屏幕”。',
    iosStep1: '在 iPhone / iPad 上使用 Safari 浏览器打开。',
    iosStep2: '点击底部分享按钮（带向上箭头的方框），选择 “添加到主屏幕”。',
    oneClickInstall: '一键直接安装就绪',
    oneClickDesc: '直接将 LinkBridge 安装到您的手机桌面',
    installNow: '立即安装',

    osAgentTitle: 'Native OS 全局鼠标遥控辅助代理',
    osAgentSubtitle: '在所有电脑软件（游戏、PPT、桌面）中真实控制光标',
    whySandboxTitle: '为什么浏览器会限制鼠标移动范围？',
    whySandboxDesc: '出于操作系统安全考虑，所有浏览器（Chrome、Edge、Safari）都严格禁止网页控制系统全局真实鼠标。',
    solutionTitle: '解决方案：单文件轻量级原生代理脚本',
    solutionDesc: '在电脑上运行此脚本，您的手机即可在所有软件中控制真实鼠标、打字输入和调节音量！',
    quickStepsTitle: '快速步骤（仅需 1 分钟）：',
    agentStep1Title: '1. 在电脑安装 Python 依赖库：',
    agentStep2Title: '2. 下载针对当前房间配置的脚本',
    agentStep2Desc: '脚本已自动配置您的房间 PIN 码',
    agentStep3Title: '3. 在电脑终端中运行脚本：',
    agentStep3Success: '完成！现在在手机上滑动，即可控制整个电脑系统的真实鼠标！',
    scriptCodeTitle: 'Python 脚本代码（已针对房间预设）：',
    downloadScript: '下载 .py 文件',
    copyCode: '复制代码',

    simulatorInfo: '模拟器模式：在同一屏幕内并排测试电脑端（左）与手机端（右）的实时互动！',
  },

  vi: {
    appName: 'LinkBridge',
    tagline: 'Kết nối liên thiết bị',
    laptopMode: 'Chế độ Laptop',
    phoneMode: 'Chế độ Điện thoại',
    simulatorMode: 'Trình mô phỏng',
    pairingCode: 'Mã ghép nối PIN',
    connectPhone: 'Kết nối Điện thoại',
    installApk: 'Cài đặt APK',
    ringPhone: 'Rung chuông tìm điện thoại',
    connected: 'Đã kết nối',
    disconnected: 'Đã ngắt kết nối',
    waitingForLaptop: 'Đang đợi Laptop...',
    waitingForPhone: 'Đang đợi Điện thoại...',
    latency: 'Độ trễ',
    device: 'Thiết bị',
    room: 'Phòng',
    copyright: '© 2026 SASAM. Bảo lưu mọi quyền.',
    activeStatus: 'HOẠT ĐỘNG',
    copied: 'Đã sao chép!',
    copy: 'Sao chép',
    share: 'Chia sẻ',
    close: 'Đóng',
    gotIt: 'Đã hiểu',

    tabFiles: 'Tệp tin',
    tabClipboard: 'Bộ nhớ tạm & Ghi chú',
    tabTrackpad: 'Bàn di chuột',
    tabPresentation: 'Thuyết trình',
    tabCamera: 'Máy ảnh không dây',
    tabKeyboard: 'Gõ phím & Đa phương tiện',

    dragDropFiles: 'Kéo & thả tệp vào đây, hoặc nhấp để duyệt',
    browseFiles: 'Chọn tệp',
    transferHistory: 'Lịch sử truyền tệp',
    autoSync: 'Tự động đồng bộ',
    noFilesYet: 'Chưa có tệp nào được gửi. Nhấp vào nút phía trên để gửi.',
    sendToPhone: 'Gửi đến Điện thoại',
    sendToLaptop: 'Gửi Tệp / Ảnh',
    takePhotoSend: 'Chụp & Gửi ngay',
    galleryDocs: 'Thư viện & Tài liệu',
    download: 'Tải xuống',
    sendingToLaptop: 'Đang gửi đến Laptop...',
    readyForDownload: 'Sẵn sàng tải về',
    clearHistory: 'Xóa lịch sử',

    sendToClipboard: 'Gửi đến bộ nhớ tạm Laptop',
    pasteFromDevice: 'Dán từ thiết bị',
    sharedNotes: 'Ghi chú đồng thời thời gian thực',
    sharedNotesDesc: 'Đồng bộ hóa tức thì trên mọi thiết bị ghép nối',
    clipboardHistory: 'Lịch sử bộ nhớ tạm',
    noClipboardYet: 'Chưa có mục nào trong bộ nhớ tạm. Gõ phía trên để đồng bộ.',
    notesPlaceholder: 'Nhập ghi chú chung tại đây...',
    inputPlaceholder: 'Nhập hoặc dán văn bản/liên kết...',
    send: 'Gửi',
    quickPaste: 'Dán nhanh',
    copyAll: 'Sao chép tất cả',

    trackpadTitle: 'Bàn di chuột không dây',
    trackpadGuide: '1 ngón: Di chuyển • Chạm: Nhấp chuột • 2 ngón: Chuột phải • Thanh phải: Cuộn trang',
    touchpadArea: 'Lướt ngón tay tại đây để điều khiển con trỏ',
    leftClick: 'Chuột trái',
    rightClick: 'Chuột phải',
    scroll: 'Cuộn trang',
    mouseTestArea: 'Khung thử nghiệm con trỏ & cuộn tương tác',
    mouseTestDesc: 'Di chuyển ngón tay trên màn hình điện thoại để kiểm tra phản hồi con trỏ tức thì',
    cursorPos: 'Vị trí con trỏ',
    sensitivity: 'Độ nhạy con trỏ',
    dragLock: 'Kéo thả',
    dragLocked: 'Đã khóa kéo',
    smoothSens: 'Mượt mà (0.5x)',
    normalSens: 'Bình thường (0.8x)',
    fastSens: 'Nhanh (1.2x)',
    highSens: 'Rất nhanh (1.6x)',
    osCursorPrompt: 'Bạn muốn điều khiển con trỏ thật trên toàn hệ thống Windows/Mac (Game, PPT, Desktop)?',
    activateOsAgent: 'Kích hoạt Native OS Agent',

    liveTextInput: 'Gửi văn bản trực tiếp đến Laptop',
    typePlaceholder: 'Nhập văn bản tại đây và nhấn gửi...',
    mediaControls: 'Điều khiển Đa phương tiện & Âm lượng',
    mediaDesc: 'YouTube / Trình phát Video',
    volUp: 'Âm lượng +',
    volDown: 'Âm lượng -',
    mute: 'Tắt tiếng',
    fullscreen: 'Toàn màn hình (F)',
    prev: 'Trước đó',
    next: 'Kế tiếp',
    play: 'Phát',
    pause: 'Tạm dừng',
    shortcutsTitle: 'Phím tắt & Điều hướng',
    enter: 'Enter',
    backspace: 'Xóa',
    space: 'Dấu cách',
    mediaPlayerSim: 'Mô phỏng Trình phát Đa phương tiện',
    mediaPlayerDesc: 'Phản hồi tức thì các lệnh từ điện thoại',
    liveTypingReceiver: 'Bộ nhận gõ phím trực tiếp',
    liveTypingDesc: 'Nhận luồng văn bản gõ phím thời gian thực từ điện thoại',
    copyIncomingText: 'Sao chép văn bản nhận được',
    waitingForTyping: 'Đang đợi văn bản nhập từ điện thoại...',

    presentationTimer: 'Hẹn giờ thuyết trình',
    slidePrev: 'Slide trước',
    slideNext: 'Slide kế tiếp',
    virtualLaser: 'Bút chỉ Laser ảo',
    laserDesc: 'Chạm và kéo để chiếu tia laser đỏ lên màn hình laptop',
    laserTouchHint: 'Nhấn giữ và kéo trong khu vực này để chiếu tia laser lên laptop',
    activeSlide: 'Slide hiện tại',
    presentationViewerTitle: 'Máy chiếu Slide Thuyết trình',
    presentationViewerDesc: 'Chuyển slide từ xa và sử dụng bút chỉ laser từ điện thoại',
    fullSlideMode: 'Thuyết trình toàn màn hình',

    cameraTitle: 'Camera Điện thoại Không dây',
    cameraDesc: 'Phát video trực tiếp từ camera điện thoại để quét tài liệu hoặc làm webcam',
    startStreaming: 'Bắt đầu phát Camera',
    stopStreaming: 'Dừng Camera',
    takeSnapshot: 'Chụp & Gửi ảnh',
    flipCamera: 'Đổi Camera',
    streamingLive: 'ĐANG PHÁT ĐẾN LAPTOP',
    snapshotSent: 'Đã gửi ảnh đến Laptop!',
    cameraViewerTitle: 'Khung hình Camera trực tiếp',
    cameraViewerDesc: 'Luồng video thời gian thực truyền không dây từ camera điện thoại',
    cameraOffline: 'Camera đang tắt. Hãy nhấn Bắt đầu Camera trên điện thoại.',

    scanQrTitle: 'Kết nối Điện thoại với Laptop',
    scanQrSubtitle: 'Quét mã QR bằng camera điện thoại hoặc nhập mã PIN phòng',
    scanInstruction: 'Quét bằng Camera Điện thoại / Google Lens / Chrome',
    roomPinLabel: 'Mã ghép nối PIN phòng:',
    copyPhoneLink: 'Sao chép liên kết Điện thoại',
    linkCopied: 'Đã sao chép!',
    pairingNote: 'Nếu quét camera không tự mở liên kết: hãy mở trình duyệt trên điện thoại, truy cập địa chỉ này và nhập mã PIN phía trên.',
    customPinLabel: 'Mã PIN phòng tùy chỉnh:',
    apply: 'Áp dụng',
    generateNew: 'Tạo mã ngẫu nhiên',
    testInBrowser: 'Thử nghiệm trực tiếp trong trình duyệt này:',
    openPhoneMode: 'Mở chế độ Điện thoại',
    enterRoomPin: 'Nhập mã PIN phòng của Laptop:',
    connect: 'Kết nối ngay',
    syncPin: 'Đồng bộ mã PIN',
    laptopNotConnected: 'Chưa kết nối Laptop',
    tapToSyncPin: 'Nhấn vào đây để đồng bộ mã PIN với màn hình laptop',

    installTitle: 'Cài đặt như ứng dụng APK trên di động',
    installSubtitle: 'Công nghệ PWA WebAPK cho phép chạy toàn màn hình mượt mà như ứng dụng gốc',
    androidStep1: 'Mở ứng dụng này trong Google Chrome trên điện thoại Android của bạn.',
    androidStep2: 'Nhấn vào menu 3 chấm (⋮) ở góc trên bên phải trình duyệt.',
    androidStep3: 'Chọn "Cài đặt ứng dụng" hoặc "Thêm vào màn hình chính".',
    iosStep1: 'Mở trong Safari trên iPhone / iPad.',
    iosStep2: 'Nhấn vào nút Chia sẻ (biểu tượng hộp có mũi tên lên) và chọn "Thêm vào màn hình chính".',
    oneClickInstall: 'Sẵn sàng cài đặt trực tiếp 1-chạm',
    oneClickDesc: 'Cài đặt LinkBridge trực tiếp vào danh sách ứng dụng điện thoại',
    installNow: 'Cài đặt ngay',

    osAgentTitle: 'Native OS Remote Mouse Companion',
    osAgentSubtitle: 'Điều khiển con trỏ hệ thống thật trên toàn bộ Windows / macOS / Linux',
    whySandboxTitle: 'Tại sao trình duyệt lại giới hạn con trỏ trong thẻ web?',
    whySandboxDesc: 'Vì lý do bảo mật, tất cả các trình duyệt web (Chrome, Edge, Safari) đều cấm trang web điều khiển con trỏ chuột vật lý của hệ điều hành bên ngoài thẻ web.',
    solutionTitle: 'Giải pháp: Script đồng hành gọn nhẹ 1 tệp',
    solutionDesc: 'Chạy script đồng hành nhỏ này trên laptop. Điện thoại của bạn sẽ ngay lập tức điều khiển chuột thật, bàn phím và âm lượng trên mọi ứng dụng máy tính (PowerPoint, Game, File Explorer)!',
    quickStepsTitle: 'Các bước nhanh (chỉ 1 phút):',
    agentStep1Title: '1. Cài đặt thư viện Python trên laptop:',
    agentStep2Title: '2. Tải Script đồng hành cho phòng của bạn',
    agentStep2Desc: 'Tệp script đã được thiết lập sẵn mã PIN phòng của bạn',
    agentStep3Title: '3. Chạy script trong cửa sổ lệnh trên laptop:',
    agentStep3Success: 'Hoàn tất! Bây giờ di chuyển tay trên điện thoại, con trỏ máy tính sẽ di chuyển khắp màn hình!',
    scriptCodeTitle: 'Mã script Python (Cấu hình sẵn cho phòng):',
    downloadScript: 'Tải .py',
    copyCode: 'Sao chép mã',

    simulatorInfo: 'Chế độ mô phỏng: Kiểm tra tương tác liên thiết bị Laptop (trái) & Điện thoại (phải) song song trên một màn hình!',
  },
};
