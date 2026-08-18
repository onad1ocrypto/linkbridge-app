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

  // Clipboard & Notes
  sendToClipboard: string;
  pasteFromDevice: string;
  sharedNotes: string;
  sharedNotesDesc: string;
  clipboardHistory: string;
  noClipboardYet: string;
  copied: string;
  copy: string;
  notesPlaceholder: string;
  inputPlaceholder: string;
  send: string;

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

  // Presentation
  presentationTimer: string;
  slidePrev: string;
  slideNext: string;
  virtualLaser: string;
  laserDesc: string;
  laserTouchHint: string;
  activeSlide: string;

  // Camera
  cameraTitle: string;
  cameraDesc: string;
  startStreaming: string;
  stopStreaming: string;
  takeSnapshot: string;
  flipCamera: string;
  streamingLive: string;
  snapshotSent: string;

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

  // PWA / APK
  installTitle: string;
  installSubtitle: string;
  androidStep1: string;
  androidStep2: string;
  androidStep3: string;
  iosStep1: string;
  iosStep2: string;
  gotIt: string;
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

    sendToClipboard: 'Send to Laptop Clipboard',
    pasteFromDevice: 'Paste from Device',
    sharedNotes: 'Collaborative Real-time Notes',
    sharedNotesDesc: 'Synchronized with all paired devices',
    clipboardHistory: 'Clipboard Feed',
    noClipboardYet: 'No clipboard items yet. Type above to sync.',
    copied: 'Copied!',
    copy: 'Copy',
    notesPlaceholder: 'Type collaborative notes here...',
    inputPlaceholder: 'Type or paste text/URL...',
    send: 'Send',

    trackpadTitle: 'Wireless Trackpad',
    trackpadGuide: '1 Finger: Move • Tap: Click • 2 Fingers: Right Click • Right Bar: Scroll',
    touchpadArea: 'Slide fingers here to move cursor',
    leftClick: 'Left Click',
    rightClick: 'Right Click',
    scroll: 'Scroll',
    mouseTestArea: 'Interactive Cursor Canvas',
    mouseTestDesc: 'Move your finger on your phone touchpad to test real-time cursor response',
    cursorPos: 'Cursor Position',

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

    presentationTimer: 'Presentation Timer',
    slidePrev: 'Previous Slide',
    slideNext: 'Next Slide',
    virtualLaser: 'Virtual Laser Pointer',
    laserDesc: 'Touch and drag to highlight points on laptop screen',
    laserTouchHint: 'Hold & drag here to project laser pointer on laptop screen',
    activeSlide: 'Current Slide',

    cameraTitle: 'Wireless Phone Camera',
    cameraDesc: 'Stream live video from smartphone camera for document scanning or wireless webcam',
    startStreaming: 'Start Camera Stream',
    stopStreaming: 'Stop Camera',
    takeSnapshot: 'Take & Send Photo',
    flipCamera: 'Flip Camera',
    streamingLive: 'STREAMING TO LAPTOP',
    snapshotSent: 'Photo Sent to Laptop!',

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
    gotIt: 'Got It',
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

    sendToClipboard: 'Kirim ke Clipboard Laptop',
    pasteFromDevice: 'Tempel dari Perangkat',
    sharedNotes: 'Catatan Bersama Real-Time',
    sharedNotesDesc: 'Tersinkron dengan semua perangkat terhubung',
    clipboardHistory: 'Riwayat Clipboard',
    noClipboardYet: 'Belum ada riwayat clipboard. Ketik di atas untuk sinkronisasi.',
    copied: 'Tersalin!',
    copy: 'Salin',
    notesPlaceholder: 'Ketik catatan bersama di sini...',
    inputPlaceholder: 'Ketik atau tempel teks/link...',
    send: 'Kirim',

    trackpadTitle: 'Touchpad Nirkabel',
    trackpadGuide: '1 Jari: Gerak • Tap: Klik • 2 Jari: Klik Kanan • Bilah Kanan: Scroll',
    touchpadArea: 'Geser jari di sini untuk mengarahkan kursor',
    leftClick: 'Klik Kiri',
    rightClick: 'Klik Kanan',
    scroll: 'Scroll',
    mouseTestArea: 'Kanvas Uji Kursor Interaktif',
    mouseTestDesc: 'Gerakkan jari pada touchpad HP Anda untuk melihat pergerakan kursor secara langsung',
    cursorPos: 'Posisi Kursor',

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

    presentationTimer: 'Pengatur Waktu Presentasi',
    slidePrev: 'Slide Sebelumnya',
    slideNext: 'Slide Berikutnya',
    virtualLaser: 'Virtual Laser Pointer',
    laserDesc: 'Sentuh & geser untuk menyorot bagian di layar laptop',
    laserTouchHint: 'Tahan & geser jari di sini untuk menyalakan laser merah di layar laptop',
    activeSlide: 'Slide Saat Ini',

    cameraTitle: 'Kamera Nirkabel HP',
    cameraDesc: 'Streaming video langsung dari kamera HP untuk pemindai dokumen atau webcam nirkabel',
    startStreaming: 'Mulai Streaming Kamera',
    stopStreaming: 'Hentikan Kamera',
    takeSnapshot: 'Ambil & Kirim Foto',
    flipCamera: 'Balik Kamera',
    streamingLive: 'STREAMING KE LAPTOP',
    snapshotSent: 'Foto Terkirim ke Laptop!',

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
    gotIt: 'Mengerti',
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

    sendToClipboard: '发送至电脑剪贴板',
    pasteFromDevice: '从设备粘贴',
    sharedNotes: '实时协同笔记',
    sharedNotesDesc: '在所有配对设备间即时同步',
    clipboardHistory: '剪贴板历史',
    noClipboardYet: '暂无剪贴板记录。在上方输入即可同步。',
    copied: '已复制！',
    copy: '复制',
    notesPlaceholder: '在此输入协同笔记...',
    inputPlaceholder: '输入或粘贴文本/网址...',
    send: '发送',

    trackpadTitle: '无线触控板',
    trackpadGuide: '单指: 移动 • 点击: 左键 • 双指: 右键 • 右侧条: 滚动',
    touchpadArea: '在此区域滑动控制光标',
    leftClick: '左键点击',
    rightClick: '右键点击',
    scroll: '滚动',
    mouseTestArea: '实时光标画布',
    mouseTestDesc: '在手机触控板上滑动以测试电脑端的实时光标响应',
    cursorPos: '光标坐标',

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
    shortcutsTitle: '导航与快捷键',
    enter: '回车 (Enter)',
    backspace: '退格',
    space: '空格',

    presentationTimer: '演示计时器',
    slidePrev: '上一页幻灯片',
    slideNext: '下一页幻灯片',
    virtualLaser: '虚拟激光笔',
    laserDesc: '按住并滑动以在电脑屏幕上投射激光红点',
    laserTouchHint: '按住并在区域内滑动即可激活电脑屏幕激光点',
    activeSlide: '当前幻灯片',

    cameraTitle: '手机无线摄像头',
    cameraDesc: '将手机摄像头实时流式传输至电脑，用于扫描文档或充当无线网络摄像头',
    startStreaming: '开启摄像头',
    stopStreaming: '停止摄像头',
    takeSnapshot: '拍照并发送',
    flipCamera: '翻转镜头',
    streamingLive: '正在向电脑推流',
    snapshotSent: '照片已发送至电脑！',

    scanQrTitle: '连接手机与电脑',
    scanQrSubtitle: '使用手机相机扫描二维码或输入 PIN 码',
    scanInstruction: '支持手机相机 / 微信扫一扫 / Chrome 扫描',
    roomPinLabel: '房间配对 PIN 码:',
    copyPhoneLink: '复制手机端链接',
    linkCopied: '已复制！',
    pairingNote: '若相机无法直接打开：请在手机浏览器输入本站网址并填入上方 PIN 码。',
    customPinLabel: '自定义房间 PIN 码:',
    apply: '应用',
    generateNew: '随机生成',
    testInBrowser: '在本浏览器直接测试:',
    openPhoneMode: '切换至手机视图',
    enterRoomPin: '输入电脑端房间 PIN 码:',
    connect: '连接',
    syncPin: '同步 PIN 码',
    laptopNotConnected: '电脑尚未连接',
    tapToSyncPin: '点击此处输入电脑屏幕显示的 PIN 码',

    installTitle: '安装为手机原生应用 (APK)',
    installSubtitle: 'PWA WebAPK 技术支持全屏原生体验',
    androidStep1: '在 Android 手机上使用 Google Chrome 打开此网站。',
    androidStep2: '点击右上角菜单 (⋮)。',
    androidStep3: '选择“安装应用”或“添加到主屏幕”。',
    iosStep1: '在 iPhone / iPad 上使用 Safari 浏览器打开。',
    iosStep2: '点击底部分享按钮并选择“添加到主屏幕”。',
    gotIt: '知道了',
  },

  vi: {
    appName: 'LinkBridge',
    tagline: 'Kết Nối Đa Thiết Bị',
    laptopMode: 'Giao Diện Laptop',
    phoneMode: 'Giao Diện Điện Thoại',
    simulatorMode: 'Mô Phỏng',
    pairingCode: 'Mã PIN Ghép Nối',
    connectPhone: 'Kết Nối Điện Thoại',
    installApk: 'Cài Đặt APK',
    ringPhone: 'Đổ Chuông Tìm Điện Thoại',
    connected: 'Đã Kết Nối',
    disconnected: 'Chưa Kết Nối',
    waitingForLaptop: 'Đang chờ Laptop...',
    waitingForPhone: 'Đang chờ Điện thoại...',
    latency: 'Độ trễ',
    device: 'Thiết bị',
    room: 'Phòng',
    copyright: '© 2026 SASAM. Bảo lưu mọi quyền.',

    tabFiles: 'Tệp Tin',
    tabClipboard: 'Bảng Tạm & Ghi Chú',
    tabTrackpad: 'Bàn Rê Chuột',
    tabPresentation: 'Thuyết Trình',
    tabCamera: 'Camera Điện Thoại',
    tabKeyboard: 'Nhập Liệu & Media',

    dragDropFiles: 'Kéo thả tệp vào đây hoặc bấm để duyệt',
    browseFiles: 'Chọn Tệp',
    transferHistory: 'Lịch Sử Truyền Tệp',
    autoSync: 'Tự Động Đồng Bộ',
    noFilesYet: 'Chưa có tệp nào. Bấm nút phía trên để gửi.',
    sendToPhone: 'Gửi Đến Điện Thoại',
    sendToLaptop: 'Gửi Tệp / Ảnh',
    takePhotoSend: 'Chụp & Gửi Ngay',
    galleryDocs: 'Thư Viện & Tài Liệu',
    download: 'Tải Về',
    sendingToLaptop: 'Đang gửi đến Laptop...',

    sendToClipboard: 'Gửi Đến Bảng Tạm Laptop',
    pasteFromDevice: 'Dán Từ Thiết Bị',
    sharedNotes: 'Ghi Chú Chung Thời Gian Thực',
    sharedNotesDesc: 'Đồng bộ tức thì giữa các thiết bị kết nối',
    clipboardHistory: 'Lịch Sử Bảng Tạm',
    noClipboardYet: 'Chưa có mục bảng tạm. Nhập phía trên để đồng bộ.',
    copied: 'Đã Sao Chép!',
    copy: 'Sao Chép',
    notesPlaceholder: 'Nhập ghi chú chung tại đây...',
    inputPlaceholder: 'Nhập hoặc dán văn bản/đường dẫn...',
    send: 'Gửi',

    trackpadTitle: 'Touchpad Không Dây',
    trackpadGuide: '1 Ngón: Di chuột • Chạm: Chuột trái • 2 Ngón: Chuột phải • Thanh phải: Cuộn',
    touchpadArea: 'Vuốt ngón tay ở đây để di chuyển con trỏ',
    leftClick: 'Chuột Trái',
    rightClick: 'Chuột Phải',
    scroll: 'Cuộn Trang',
    mouseTestArea: 'Khu Vực Thử Nghiệm Con Trỏ',
    mouseTestDesc: 'Di chuyển ngón tay trên màn hình điện thoại để thấy con trỏ phản hồi theo thời gian thực',
    cursorPos: 'Tọa Độ Con Trỏ',

    liveTextInput: 'Gửi Văn Bản Trực Tiếp Đến Laptop',
    typePlaceholder: 'Nhập văn bản rồi bấm gửi...',
    mediaControls: 'Điều Khiển Âm Lượng & Media',
    mediaDesc: 'YouTube / Trình phát Video',
    volUp: 'Âm Lượng +',
    volDown: 'Âm Lượng -',
    mute: 'Tắt Tiếng',
    fullscreen: 'Toàn Màn Hình (F)',
    prev: 'Trước',
    next: 'Tiếp',
    play: 'Phát',
    pause: 'Tạm Dừng',
    shortcutsTitle: 'Phím Tắt & Điều Hướng',
    enter: 'Enter',
    backspace: 'Xóa',
    space: 'Dấu Cách',

    presentationTimer: 'Bộ Đếm Thời Gian Thuyết Trình',
    slidePrev: 'Slide Trước',
    slideNext: 'Slide Tiếp Theo',
    virtualLaser: 'Bút Laser Ảo',
    laserDesc: 'Chạm và kéo để chiếu điểm laser đỏ lên màn hình laptop',
    laserTouchHint: 'Chạm và di chuyển ngón tay ở đây để bật laser đỏ trên màn hình laptop',
    activeSlide: 'Slide Hiện Tại',

    cameraTitle: 'Camera Điện Thoại Không Dây',
    cameraDesc: 'Truyền trực tiếp camera điện thoại sang laptop để quét tài liệu hoặc làm webcam',
    startStreaming: 'Bắt Đầu Phát Camera',
    stopStreaming: 'Dừng Camera',
    takeSnapshot: 'Chụp & Gửi Ảnh',
    flipCamera: 'Đổi Camera',
    streamingLive: 'ĐANG PHÁT ĐẾN LAPTOP',
    snapshotSent: 'Đã gửi ảnh đến Laptop!',

    scanQrTitle: 'Kết Nối Điện Thoại Với Laptop',
    scanQrSubtitle: 'Quét mã QR bằng camera hoặc nhập mã PIN phòng',
    scanInstruction: 'Quét bằng Camera Điện Thoại / Google Lens / Chrome',
    roomPinLabel: 'Mã PIN Ghép Nối Phòng:',
    copyPhoneLink: 'Sao Chép Link Điện Thoại',
    linkCopied: 'Đã Sao Chép!',
    pairingNote: 'Nếu camera không tự mở link: hãy mở trình duyệt trên điện thoại, truy cập trang web này và nhập mã PIN ở trên.',
    customPinLabel: 'Tạo Mã PIN Tự Chọn:',
    apply: 'Áp Dụng',
    generateNew: 'Tạo Mã Ngẫu Nhiên',
    testInBrowser: 'Thử nghiệm trực tiếp trong trình duyệt này:',
    openPhoneMode: 'Mở Chế Độ Điện Thoại',
    enterRoomPin: 'Nhập Mã PIN Phòng Của Laptop:',
    connect: 'Kết Nối',
    syncPin: 'Đồng Bộ PIN',
    laptopNotConnected: 'Laptop Chưa Kết Nối',
    tapToSyncPin: 'Chạm vào đây để nhập mã PIN trùng với màn hình laptop',

    installTitle: 'Cài Đặt Như Ứng Dụng APK Trên Điện Thoại',
    installSubtitle: 'Công nghệ PWA WebAPK mang lại trải nghiệm toàn màn hình như ứng dụng gốc',
    androidStep1: 'Mở trang web này trong Google Chrome trên điện thoại Android.',
    androidStep2: 'Nhấn vào menu 3 chấm (⋮) ở góc trên bên phải.',
    androidStep3: 'Chọn "Cài đặt ứng dụng" hoặc "Thêm vào Màn hình chính".',
    iosStep1: 'Mở bằng Safari trên iPhone / iPad.',
    iosStep2: 'Nhấn nút Chia sẻ (biểu tượng hộp có mũi tên lên) và chọn "Thêm vào Màn hình chính".',
    gotIt: 'Đã Hiểu',
  },
};
