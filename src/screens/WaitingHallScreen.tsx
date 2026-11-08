import React, { useState } from 'react';
import { Player, ScreenId, TransitionType } from '../types/game';
import { sound } from '../utils/audio';
import { RITUAL_TABLE_IMG } from '../data/initialData';
import { Users, CheckCircle2, Clock, Copy, Check, Sparkles, AlertCircle, Share2, Smartphone, MessageCircle } from 'lucide-react';

interface WaitingHallScreenProps {
  players: Player[];
  onTogglePlayerReady: (playerId: string) => void;
  onNavigate: (screen: ScreenId, transition: TransitionType) => void;
  roomCode: string;
  onOpenShare?: () => void;
}

export const WaitingHallScreen: React.FC<WaitingHallScreenProps> = ({
  players,
  onTogglePlayerReady,
  onNavigate,
  roomCode,
  onOpenShare,
}) => {
  const [copied, setCopied] = useState(false);
  const [gameMode, setGameMode] = useState<'normal' | 'advanced'>('normal');

  const readyCount = players.filter((p) => p.isReady).length;
  const isSelfReady = players.find((p) => p.id === 'p1')?.isReady ?? true;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(roomCode);
    setCopied(true);
    sound.playReadyChime();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReadyToggleAndProceed = () => {
    sound.playReadyChime();
    // Toggle player status if needed and proceed to role distribution
    onNavigate('role-distribution', 'push');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
      {/* Hero Banner with Dark Gothic Grimoire Table */}
      <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/60 min-h-[220px] flex flex-col justify-end p-6 md:p-8">
        <img
          src={RITUAL_TABLE_IMG}
          alt="طاولة طقوس الجلسة"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-35"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium tracking-wide">
            <span>جلسة الغسق المظلم</span>
            <span aria-hidden="true">·</span>
            <span>غرفة رقم {roomCode}</span>
            <span aria-hidden="true">·</span>
            <span>نمط مجلس الحكماء والظلال</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold font-gothic text-zinc-100 tracking-tight">
            غرفة الانتظار واستعداد اللاعبين
          </h1>
          <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
            اجتمع حكماء القرية وأهاليها حول الطاولة القديمة. تأكد من اكتمال جاهزية جميع الحضور قبل
            البدء في سحب وتوزيع بطاقات الأدوار السرية.
          </p>
        </div>
      </div>

      {/* Main Grid: Control Bar & Player Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Room Summary & Ready Action (1 col) */}
        <div className="space-y-6">
          {/* Room Card */}
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium">رمز مشاركة المجلس</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
              </button>
            </div>
            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-center">
              <span className="font-mono text-2xl font-bold tracking-widest text-amber-400">
                {roomCode}
              </span>
            </div>

            {/* Direct Mobile Share Trigger */}
            {onOpenShare && (
              <button
                onClick={() => {
                  sound.playReadyChime();
                  onOpenShare();
                }}
                className="w-full py-2.5 px-3 bg-zinc-800/90 hover:bg-zinc-700/90 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:border-amber-400"
              >
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>مشاركة الرابط والباركود للجوال (واتساب)</span>
              </button>
            )}

            <div className="space-y-2 pt-2 border-t border-zinc-800/80 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>إجمالي المقاعد المشغولة:</span>
                <span className="text-zinc-200 font-semibold">{players.length} لاعبين</span>
              </div>
              <div className="flex justify-between">
                <span>المستعدون للدخول:</span>
                <span className="text-emerald-400 font-semibold">
                  {readyCount} من {players.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>صوت الطقس:</span>
                <span className="text-zinc-300">مفعل تلقائياً</span>
              </div>
            </div>

            {/* Mode selection buttons */}
            <div className="pt-2">
              <label className="text-xs text-zinc-400 block mb-2 font-medium">مستوى صعوبة الأدوار</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setGameMode('normal')}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                    gameMode === 'normal'
                      ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  مجلس المبتدئين
                </button>
                <button
                  onClick={() => setGameMode('advanced')}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                    gameMode === 'advanced'
                      ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  مجلس المتمرسين
                </button>
              </div>
            </div>

            {/* REQUIRED SPEC ELEMENT: //button[@id='readyToggleBtn'] */}
            <div className="pt-3">
              <button
                id="readyToggleBtn"
                onClick={handleReadyToggleAndProceed}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-zinc-950 font-bold rounded-xl shadow-lg shadow-amber-950/40 hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-zinc-950" />
                <span>تأكيد الجاهزية والانتقال لتوزيع البطاقات</span>
              </button>
              <p className="text-[11px] text-zinc-500 text-center mt-2">
                ينقلك مباشرة إلى شاشة توزيع بطاقات اللعبة وغرفة اللاعبين
              </p>
            </div>
          </div>

          {/* Quick Rules Advisory */}
          <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 space-y-2">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
              <AlertCircle className="w-4 h-4" />
              <span>إرشادات الجلسة</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              لا تكشف دورك لأي شخص بعد سحب البطاقة. يمكن للجميع التحدث والكذب أثناء النهار، لكن
              التصويت على منصة الإعدام حاسم ولا رجعة فيه.
            </p>
          </div>
        </div>

        {/* Right Column: Player Roster & Interactive Ready States (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold font-gothic text-zinc-100">
                قائمة اللاعبين حول الدائرة ({players.length})
              </h2>
            </div>
            <div className="text-xs text-zinc-400 flex items-center gap-2">
              <span>انقر على أي لاعب لتبديل حالة استعداده</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {players.map((player, idx) => (
              <div
                key={player.id}
                onClick={() => {
                  sound.playReadyChime();
                  onTogglePlayerReady(player.id);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  player.isReady
                    ? 'bg-zinc-900/90 border-zinc-700/80 hover:border-amber-500/50'
                    : 'bg-zinc-950/80 border-zinc-800/60 opacity-75 hover:opacity-100 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      player.isStoryteller
                        ? 'bg-amber-500 text-zinc-950 ring-2 ring-amber-400/40'
                        : player.isReady
                        ? 'bg-zinc-800 text-amber-400 border border-zinc-700'
                        : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
                      <span>{player.name}</span>
                      {player.isStoryteller && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-medium">
                          الراوي
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {player.id === 'p1' ? 'أنت (مضيف المجلس)' : 'عضو في القرية'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {player.isReady ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-950/40 border border-emerald-800/40 px-2 py-1 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>مستعد</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-zinc-500 bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      <span>ينتظر</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Ready / Unready toggle button for self */}
          <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 flex items-center justify-between">
            <div className="text-xs text-zinc-400">
              حالتك الحالية:{' '}
              <span className={isSelfReady ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                {isSelfReady ? 'مستعد لبدء الطقس' : 'غير مستعد'}
              </span>
            </div>
            <button
              onClick={() => {
                sound.playReadyChime();
                onTogglePlayerReady('p1');
              }}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
            >
              {isSelfReady ? 'إلغاء جاهزيتي' : 'تأكيد جاهزيتي'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
