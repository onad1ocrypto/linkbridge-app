import React, { useState } from 'react';
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Sparkles,
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { Language, translations } from '../../utils/i18n';

interface PresentationViewerProps {
  presentationState: {
    slideIndex: number;
    laserActive: boolean;
    laserX: number;
    laserY: number;
  };
  onSendSlideAction: (action: 'next' | 'prev' | 'first') => void;
  currentLang?: Language;
}

const getSlidesForLang = (lang: Language | string = 'en') => {
  if (lang === 'id') {
    return [
      {
        title: 'LinkBridge: Konektivitas HP ↔ Laptop',
        subtitle: 'Solusi Cerdas Kolaborasi Antar Perangkat Tanpa Kabel',
        points: [
          '⚡ Transfer file instan berkecepatan tinggi tanpa batasan kabel',
          '🖱️ Jadikan smartphone sebagai remote mouse, trackpad, dan keyboard',
          '📋 Shared Clipboard tersinkronisasi otomatis dua arah',
          '🎯 Remote Presenter PowerPoint & Laser Pointer nirkabel',
        ],
        bg: 'from-slate-900 via-amber-950/40 to-slate-950',
      },
      {
        title: 'Kecepatan & Privasi Tanpa Cloud Pihak Ketiga',
        subtitle: 'Komunikasi Peer-to-Peer & Enkripsi Lokal',
        points: [
          '🔒 Data ditransfer langsung antar browser melalui jaringan lokal / WebSocket aman',
          '📱 Kompatibel dengan Android, iOS, Windows, Mac, dan Linux',
          '📦 Dapat di-install langsung sebagai APK PWA di HP Anda',
          '🔋 Hemat daya baterai dengan arsitektur event-driven efisien',
        ],
        bg: 'from-slate-900 via-yellow-950/40 to-slate-950',
      },
      {
        title: 'Fitur Presenter & Kamera Streamer',
        subtitle: 'Tingkatkan Produktivitas Kerja & Presentasi Anda',
        points: [
          '🎯 Kendalikan slide dari panggung menggunakan tombol HP',
          '🔴 Virtual Laser Pointer gyro bergerak mulus di layar proyektor',
          '📷 Pindai dokumen fisik atau gunakan HP sebagai webcam cadangan',
          '🔔 Bunyikan HP jika terselip di bawah meja atau tas kerja',
        ],
        bg: 'from-slate-900 via-amber-900/30 to-slate-950',
      },
      {
        title: 'Terima Kasih!',
        subtitle: 'Mulai hubungkan perangkat Anda sekarang',
        points: [
          '🚀 Buka LinkBridge di browser laptop Anda',
          '📱 Scan QR Code menggunakan kamera HP',
          '✨ Nikmati ekosistem terhubung tanpa batas',
        ],
        bg: 'from-slate-900 via-slate-950 to-slate-900',
      },
    ];
  } else if (lang === 'zh') {
    return [
      {
        title: 'LinkBridge: 跨设备互联生态',
        subtitle: '无需数据线的高效多端协同方案',
        points: [
          '⚡ 高速无线文件互传，无体积限制',
          '🖱️ 手机秒变电脑无线触控板、鼠标与全功能键盘',
          '📋 双向实时剪贴板与协同备忘录',
          '🎯 幻灯片遥控器与虚拟激光笔指示',
        ],
        bg: 'from-slate-900 via-amber-950/40 to-slate-950',
      },
      {
        title: '极速、安全与隐私保护',
        subtitle: '点对点通信与本地直连',
        points: [
          '🔒 数据直接在设备间传输，安全加密',
          '📱 完美适配 Android, iOS, Windows, Mac, Linux',
          '📦 支持一键安装为独立 PWA WebAPK',
          '🔋 低功耗事件驱动架构，省电流畅',
        ],
        bg: 'from-slate-900 via-yellow-950/40 to-slate-950',
      },
      {
        title: '演示遥控与无线摄像头',
        subtitle: '提升办公效率与会议体验',
        points: [
          '🎯 在讲台上远程切换 PPT 幻灯片',
          '🔴 虚拟激光红点即时投射至大屏',
          '📷 高清无线推流，支持文档扫描与备用摄像头',
          '🔔 一键响铃寻找遗落的手机',
        ],
        bg: 'from-slate-900 via-amber-900/30 to-slate-950',
      },
      {
        title: '感谢使用！',
        subtitle: '立即开启多设备互联体验',
        points: [
          '🚀 在电脑浏览器中打开 LinkBridge',
          '📱 使用手机相机扫描屏幕二维码',
          '✨ 畅享无限连接生态',
        ],
        bg: 'from-slate-900 via-slate-950 to-slate-900',
      },
    ];
  } else if (lang === 'vi') {
    return [
      {
        title: 'LinkBridge: Kết nối Đa thiết bị',
        subtitle: 'Giải pháp cộng tác không dây thông minh giữa Điện thoại và Laptop',
        points: [
          '⚡ Truyền tệp tin tốc độ cao không cần dây cáp',
          '🖱️ Biến điện thoại thành chuột, bàn di chuột và bàn phím máy tính',
          '📋 Bộ nhớ tạm đồng bộ hai chiều thời gian thực',
          '🎯 Điều khiển thuyết trình PowerPoint & Bút chỉ laser ảo',
        ],
        bg: 'from-slate-900 via-amber-950/40 to-slate-950',
      },
      {
        title: 'Tốc độ & Bảo mật Tuyệt đối',
        subtitle: 'Giao tiếp Ngang hàng (P2P) & Mã hóa Cục bộ',
        points: [
          '🔒 Dữ liệu truyền trực tiếp an toàn giữa các thiết bị',
          '📱 Tương thích hoàn hảo Android, iOS, Windows, Mac, Linux',
          '📦 Cài đặt trực tiếp dưới dạng WebAPK PWA',
          '🔋 Tiết kiệm pin tối đa với kiến trúc tối ưu',
        ],
        bg: 'from-slate-900 via-yellow-950/40 to-slate-950',
      },
      {
        title: 'Tính năng Thuyết trình & Camera Không dây',
        subtitle: 'Nâng cao năng suất công việc và hội họp',
        points: [
          '🎯 Điều khiển slide từ xa trên sân khấu',
          '🔴 Tia laser ảo mượt mà trên màn chiếu',
          '📷 Quét tài liệu và làm webcam không dây',
          '🔔 Rung chuông tìm điện thoại thất lạc',
        ],
        bg: 'from-slate-900 via-amber-900/30 to-slate-950',
      },
      {
        title: 'Xin cảm ơn!',
        subtitle: 'Bắt đầu kết nối các thiết bị ngay bây giờ',
        points: [
          '🚀 Mở LinkBridge trên trình duyệt laptop',
          '📱 Quét mã QR bằng camera điện thoại',
          '✨ Trải nghiệm hệ sinh thái kết nối không giới hạn',
        ],
        bg: 'from-slate-900 via-slate-950 to-slate-900',
      },
    ];
  }

  // English default
  return [
    {
      title: 'LinkBridge: Phone ↔ Laptop Ecosystem',
      subtitle: 'Smart Wireless Cross-Device Collaboration Platform',
      points: [
        '⚡ Instant high-speed wireless file transfer without cables',
        '🖱️ Turn smartphone into precision trackpad, mouse, and keyboard',
        '📋 Real-time two-way synchronized shared clipboard',
        '🎯 Wireless PowerPoint presentation remote & virtual laser pointer',
      ],
      bg: 'from-slate-900 via-amber-950/40 to-slate-950',
    },
    {
      title: 'High Speed, Privacy & Local Security',
      subtitle: 'Peer-to-Peer Communication & Local Encryption',
      points: [
        '🔒 Direct secure browser-to-browser communication',
        '📱 Seamless support for Android, iOS, Windows, Mac, and Linux',
        '📦 Installable as lightweight standalone PWA WebAPK',
        '🔋 Ultra-low latency and battery-efficient architecture',
      ],
      bg: 'from-slate-900 via-yellow-950/40 to-slate-950',
    },
    {
      title: 'Presenter Remote & Wireless Camera',
      subtitle: 'Boost Productivity & Presentation Confidence',
      points: [
        '🎯 Advance slides from across the stage using smartphone buttons',
        '🔴 Virtual laser pointer projects directly on laptop display',
        '📷 Stream high-res live video for document scanning or webcam',
        '🔔 Ring phone feature to quickly find misplaced devices',
      ],
      bg: 'from-slate-900 via-amber-900/30 to-slate-950',
    },
    {
      title: 'Thank You!',
      subtitle: 'Connect your devices in seconds',
      points: [
        '🚀 Open LinkBridge on your laptop browser',
        '📱 Scan QR Code with smartphone camera',
        '✨ Enjoy a seamless connected workspace',
      ],
      bg: 'from-slate-900 via-slate-950 to-slate-900',
    },
  ];
};

export const PresentationViewer: React.FC<PresentationViewerProps> = ({
  presentationState,
  onSendSlideAction,
  currentLang = 'en',
}) => {
  const t = translations[currentLang] || translations.en;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const slides = getSlidesForLang(currentLang);
  const currentSlide = slides[presentationState.slideIndex % slides.length];

  return (
    <div
      className={`bg-[#0e1017] border border-amber-500/20 rounded-3xl p-5 flex flex-col shadow-xl shadow-amber-950/10 ${
        isFullscreen ? 'fixed inset-0 z-50 bg-black rounded-none p-6' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Presentation className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200">
              {t.presentationViewerTitle}
            </h4>
            <p className="text-[11px] text-slate-400">
              {t.presentationViewerDesc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-300 font-mono font-bold bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            Slide {(presentationState.slideIndex % slides.length) + 1} / {slides.length}
          </span>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 transition-colors"
            title={t.fullSlideMode}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Slide Canvas */}
      <div
        className={`relative w-full rounded-2xl bg-gradient-to-br ${currentSlide.bg} border border-amber-500/25 flex flex-col justify-center p-8 sm:p-12 overflow-hidden shadow-2xl transition-all duration-300 min-h-[360px]`}
      >
        {/* Decorative Watermark */}
        <div className="absolute top-4 right-4 text-xs font-serif font-bold text-amber-400/40 tracking-wider">
          SASAM LINKBRIDGE
        </div>

        {/* Virtual Laser Pointer Dot */}
        {presentationState.laserActive && (
          <div
            className="absolute pointer-events-none transition-all duration-75 ease-out z-30"
            style={{
              left: `${presentationState.laserX}%`,
              top: `${presentationState.laserY}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative">
              <div className="w-6 h-6 rounded-full bg-rose-500/40 animate-ping absolute -inset-0" />
              <div className="w-4 h-4 rounded-full bg-rose-500 border-2 border-white shadow-[0_0_12px_#f43f5e]" />
            </div>
          </div>
        )}

        {/* Slide Content */}
        <div className="space-y-4 relative z-10 max-w-2xl">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-3xl font-serif font-bold text-amber-100 drop-shadow-md">
              {currentSlide.title}
            </h2>
            <p className="text-xs sm:text-sm text-amber-300/90 font-medium">
              {currentSlide.subtitle}
            </p>
          </div>

          <div className="space-y-2.5 pt-4">
            {currentSlide.points.map((pt, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 text-xs sm:text-sm text-slate-200 bg-slate-950/40 backdrop-blur-sm p-3 rounded-xl border border-white/5 shadow-sm"
              >
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manual Slide Controls */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => {
            onSendSlideAction('prev');
            sounds.playClick();
          }}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t.slidePrev}</span>
        </button>

        <span className="text-[11px] text-slate-400 font-medium">{t.laserDesc}</span>

        <button
          onClick={() => {
            onSendSlideAction('next');
            sounds.playClick();
          }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-600/20"
        >
          <span>{t.slideNext}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
