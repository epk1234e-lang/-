import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { Copy, Check, Share2, Smartphone, QrCode, MessageCircle, X } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomCode: string;
}

export const SHARED_APP_URL = 'https://ais-pre-b4am2sxutgb3qmaelrr4hy-685583730347.europe-west1.run.app';
export const DEV_APP_URL = 'https://ais-dev-b4am2sxutgb3qmaelrr4hy-685583730347.europe-west1.run.app';

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, roomCode }) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [activeUrlType, setActiveUrlType] = useState<'shared' | 'dev'>('shared');

  if (!isOpen) return null;

  const currentUrl = activeUrlType === 'shared' ? SHARED_APP_URL : DEV_APP_URL;
  const shareText = `تعال العب معنا في مجلس العفريت (لعبة الأدوار والطقوس)! 🎲🔥\nرمز الغرفة: ${roomCode}\nرابط الدخول بالجوال أو الكمبيوتر:\n${currentUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      sound.playReadyChime();
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    sound.playReadyChime();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'مجلس العفريت - طقوس الاستنتاج والمحاكمة',
          text: `انضم لمجلس اللعبة معنا برمز: ${roomCode}`,
          url: currentUrl,
        });
      } catch {
        // User dismissed
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsAppShare = () => {
    sound.playReadyChime();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  // Quick high-contrast SVG QR Code visual representation for mobile camera scanning
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}&bgcolor=18181b&color=f59e0b`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative text-right max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-1">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
            <Smartphone className="w-4 h-4 text-amber-500" />
            <span>مشاركة الرابط للعب الجماعي بالجوال</span>
          </div>
          <h3 className="text-xl font-bold font-gothic text-zinc-100">
            طريقة تشغيل ومشاركة الرابط مع أصحابك
          </h3>
          <p className="text-xs text-zinc-400">
            لفتح الرابط للجميع بدون تسجيل دخول، تأكد من خطوة النشر التالية في منصة AI Studio.
          </p>
        </div>

        {/* Critical Activation Guide Box */}
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2 text-xs text-amber-200">
          <div className="font-bold text-amber-400 flex items-center gap-1.5">
            <span>💡 لماذا لا يفتح الرابط مع أصحابك مباشرة؟</span>
          </div>
          <p className="leading-relaxed text-[11px] text-zinc-300">
            في Google AI Studio، الروابط تكون خاصة بحسابك حتى تضغط على زر <strong className="text-amber-300">&ldquo;Share&rdquo; أو &ldquo;مشاركة&rdquo;</strong> الموجود في أعلى يمين شاشة المتصفح (بجانب زر Run).
            <br />
            بمجرد الضغط على <strong>Share</strong> وتحديد <strong>Public / Anyone with the link</strong>، يصبح الرابط فعالاً لجميع أصحابك على أي جوال!
          </p>
        </div>

        {/* URL Type Switcher */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => setActiveUrlType('shared')}
            className={`p-2.5 rounded-lg border text-right transition-all cursor-pointer ${
              activeUrlType === 'shared'
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400'
            }`}
          >
            <div>رابط أصحابك (Shared)</div>
            <div className="text-[10px] text-zinc-500">يتفعل عبر زر Share بالأعلى</div>
          </button>
          <button
            onClick={() => setActiveUrlType('dev')}
            className={`p-2.5 rounded-lg border text-right transition-all cursor-pointer ${
              activeUrlType === 'dev'
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400'
            }`}
          >
            <div>رابط التطوير المباشر (Dev)</div>
            <div className="text-[10px] text-zinc-500">للتجربة بحسابك في Google</div>
          </button>
        </div>

        {/* Room Code Spotlight */}
        <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
          <div className="text-right">
            <span className="text-[10px] text-zinc-500 block">رمز الغرفة:</span>
            <span className="font-mono text-lg font-bold text-amber-400">{roomCode}</span>
          </div>
          <span className="text-[11px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
            مجلس يتسع لـ 7-15 لاعباً
          </span>
        </div>

        {/* Link Box */}
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-400 block font-medium">الرابط المختار:</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-300 select-all focus:outline-none focus:border-amber-500 text-left"
              dir="ltr"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-zinc-950" /> : <Copy className="w-4 h-4 text-zinc-950" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ'}</span>
            </button>
          </div>
        </div>

        {/* Quick Share Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleWhatsAppShare}
            className="py-2.5 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>إرسال عبر واتساب</span>
          </button>

          <button
            onClick={() => setShowQR(!showQR)}
            className="py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            <span>{showQR ? 'إخفاء الباركود' : 'عرض الباركود QR'}</span>
          </button>
        </div>

        {/* Native Mobile Share if supported */}
        <button
          onClick={handleNativeShare}
          className="w-full py-2 px-3 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 rounded-xl text-xs font-medium flex items-center justify-center gap-2 border border-zinc-700 transition-colors cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-zinc-400" />
          <span>مشاركة عبر تطبيقات الجوال الأخرى</span>
        </button>

        {/* QR Code Reveal */}
        {showQR && (
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex flex-col items-center justify-center space-y-2 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">
              <img
                src={qrCodeApiUrl}
                alt="رمز QR للدخول المباشر بالجوال"
                className="w-36 h-36 object-contain rounded"
              />
            </div>
            <p className="text-[11px] text-zinc-400 text-center">
              وجّه كاميرا الجوال على الباركود للدخول المباشر
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
