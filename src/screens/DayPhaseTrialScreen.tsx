import React, { useState, useEffect } from 'react';
import { Player, ScreenId, TransitionType, TrialState } from '../types/game';
import { sound } from '../utils/audio';
import {
  Gavel,
  Clock,
  ShieldCheck,
  Skull,
  Pause,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertOctagon,
  Flame,
  Volume2,
} from 'lucide-react';

interface DayPhaseTrialScreenProps {
  players: Player[];
  onNavigate: (screen: ScreenId, transition: TransitionType) => void;
  onVotePlayer: (playerId: string, choice: 'innocent' | 'guilty' | 'abstain') => void;
}

export const DayPhaseTrialScreen: React.FC<DayPhaseTrialScreenProps> = ({
  players,
  onNavigate,
  onVotePlayer,
}) => {
  const [trial, setTrial] = useState<TrialState>({
    accusedPlayerId: 'p3', // عمر الفاروق
    accuserPlayerId: 'p2', // سارة المنصور (المحقق)
    accusationReason: 'شوهد يتحدث سراً في أزقة القرية مع شخص ملثم قبل العثور على جثة الخادم.',
    votesNeeded: 5,
    timerSeconds: 45,
    timerRunning: false,
    verdict: 'none',
  });

  const [lastVerdictMessage, setLastVerdictMessage] = useState<string | null>(null);

  // Timer countdown hook
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (trial.timerRunning && trial.timerSeconds > 0) {
      interval = setInterval(() => {
        setTrial((prev) => {
          if (prev.timerSeconds <= 1) {
            sound.playGavel();
            return { ...prev, timerSeconds: 0, timerRunning: false };
          }
          return { ...prev, timerSeconds: prev.timerSeconds - 1 };
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [trial.timerRunning, trial.timerSeconds]);

  const toggleTimer = () => {
    sound.playReadyChime();
    setTrial((prev) => ({ ...prev, timerRunning: !prev.timerRunning }));
  };

  const resetTimer = () => {
    sound.playReadyChime();
    setTrial((prev) => ({ ...prev, timerSeconds: 60, timerRunning: false }));
  };

  const addTime = () => {
    sound.playReadyChime();
    setTrial((prev) => ({ ...prev, timerSeconds: prev.timerSeconds + 15 }));
  };

  const accusedPlayer = players.find((p) => p.id === trial.accusedPlayerId) || players[2];
  const accuserPlayer = players.find((p) => p.id === trial.accuserPlayerId) || players[1];

  const innocentVotes = players.filter((p) => p.voteChoice === 'innocent').length;
  const guiltyVotes = players.filter((p) => p.voteChoice === 'guilty').length;

  const handlePardonClick = () => {
    sound.playGavel();
    setTrial((prev) => ({ ...prev, verdict: 'pardoned', timerRunning: false }));
    setLastVerdictMessage(`قرر المجلس إعلان براءة المتهم (${accusedPlayer.name}). تم حفظ القضية.`);

    // Navigation requirement: Element (xpath: //button[contains(., 'بريء • عفو')]) -> غرفة اللعبة وتخصيص البطاقات وقدرات العفريت (push_back transition)
    setTimeout(() => {
      onNavigate('demon-customization', 'push_back');
    }, 450);
  };

  const handleExecuteClick = () => {
    sound.playGavel();
    setTrial((prev) => ({ ...prev, verdict: 'executed', timerRunning: false }));
    setLastVerdictMessage(`تم تنفيذ حكم الإعدام بحق (${accusedPlayer.name}). تسدل القرية ستائر الليل.`);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
      {/* Top Header & Trial Stage */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-500 font-medium mb-1">
            <Gavel className="w-3.5 h-3.5" />
            <span>جلسة وضح النهار • محاكمة المشتبه به رقم 1</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-gothic text-zinc-100">
            غرفة اللعبة ونظام التصويت بالنهار والمحاكمة
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            استمع لمرافعة المتهم وادعاء المحقق، ثم اجمع أصوات المجلس لحسم مصير المتهم بين العفو والإعدام.
          </p>
        </div>

        {/* Timer Control Badge */}
        <div className="flex items-center gap-3 shrink-0 bg-zinc-900/90 border border-zinc-700 p-2.5 rounded-xl">
          <div className="flex items-center gap-2 px-2">
            <Clock
              className={`w-4 h-4 ${trial.timerRunning ? 'text-amber-400 animate-pulse' : 'text-zinc-500'}`}
            />
            <span className="font-mono text-xl font-bold text-amber-400">
              00:{trial.timerSeconds < 10 ? `0${trial.timerSeconds}` : trial.timerSeconds}
            </span>
          </div>

          <div className="flex items-center gap-1 border-r border-zinc-800 pr-2">
            <button
              onClick={toggleTimer}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
              title={trial.timerRunning ? 'إيقاف مؤقت' : 'بدء المؤقت'}
            >
              {trial.timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={resetTimer}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              title="إعادة ضبط"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={addTime}
              className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono transition-colors cursor-pointer"
              title="إضافة 15 ثانية"
            >
              +15s
            </button>
          </div>
        </div>
      </div>

      {/* Verdict Notification Banner */}
      {lastVerdictMessage && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{lastVerdictMessage}</span>
          </div>
          <button
            onClick={() => setLastVerdictMessage(null)}
            className="text-zinc-500 hover:text-zinc-200 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: Accused Podium + Live Voting Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Accused Podium & Verdict Buttons (1 col) */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border border-zinc-700 bg-zinc-900/90 space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-500 to-rose-600" />

            <div className="text-center space-y-2 pt-2">
              <span className="text-[11px] font-semibold text-rose-400 bg-rose-950/60 border border-rose-800/40 px-2.5 py-1 rounded-full inline-block">
                المتهم قيد المحاكمة
              </span>
              <h2 className="text-xl font-bold font-gothic text-zinc-100">
                {accusedPlayer.name}
              </h2>
              <div className="text-xs text-zinc-400">
                الموجّه للتهمة: <span className="text-amber-400 font-semibold">{accuserPlayer.name}</span>
              </div>
            </div>

            {/* Accusation statement */}
            <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
              <span className="text-zinc-500 font-semibold block mb-1">لائحة الاتهام:</span>
              &ldquo;{trial.accusationReason}&rdquo;
            </div>

            {/* Threshold Progress */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">النصاب القانوني للإعدام:</span>
                <span className="font-mono text-rose-400 font-bold">
                  {guiltyVotes} / {trial.votesNeeded} أصوات
                </span>
              </div>
              <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-rose-600 transition-all duration-300"
                  style={{ width: `${Math.min(100, (guiltyVotes / trial.votesNeeded) * 100)}%` }}
                />
              </div>
            </div>

            {/* VOTE VERDICT ACTIONS */}
            <div className="space-y-2.5 pt-3 border-t border-zinc-800">
              <div className="text-xs font-semibold text-zinc-300 text-center mb-1">
                قرار المجلس النهائي
              </div>

              {/* REQUIRED SPEC ELEMENT: //button[contains(., 'بريء • عفو')] */}
              <button
                onClick={handlePardonClick}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-100" />
                <span>بريء • عفو وتخصيص قدرات العفريت</span>
              </button>

              <button
                onClick={handleExecuteClick}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-rose-950/40 border border-zinc-700 hover:border-rose-600/60 text-rose-400 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Skull className="w-4 h-4 text-rose-400" />
                <span>مذنب • إعدام الشبهة</span>
              </button>
            </div>

            <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
              الضغط على &ldquo;بريء • عفو&rdquo; يقرر براءة المتهم وينقلك إلى تخصيص بطاقات وقدرات
              العفريت كما ورد في بروتوكول المجلس.
            </p>
          </div>

          {/* Quick Gavel Strike */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
            <span className="text-xs text-zinc-400 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-500" />
              مطرقة القاضي
            </span>
            <button
              onClick={() => sound.playGavel()}
              className="px-3 py-1.5 text-xs font-semibold text-amber-400 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer border border-zinc-700"
            >
              ضرب المطرقة الصوتي
            </button>
          </div>
        </div>

        {/* Right Column: Player Voting Circle & Hands Matrix (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div>
              <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span>سجل أصوات الحاضرين في الدائرة</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                أصوات البراءة: <span className="text-emerald-400 font-mono font-bold">{innocentVotes}</span>{' '}
                · أصوات الإدانة: <span className="text-rose-400 font-mono font-bold">{guiltyVotes}</span>
              </p>
            </div>

            {/* Change accused selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-500">تغيير المتهم:</span>
              <select
                value={trial.accusedPlayerId}
                onChange={(e) => {
                  sound.playReadyChime();
                  setTrial((prev) => ({ ...prev, accusedPlayerId: e.target.value }));
                }}
                className="bg-zinc-900 border border-zinc-700 rounded-lg p-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Voting Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {players.map((player) => {
              const isAccused = player.id === trial.accusedPlayerId;

              return (
                <div
                  key={player.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between min-h-[130px] ${
                    isAccused
                      ? 'bg-rose-950/20 border-rose-600/70'
                      : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-200 truncate">
                      {player.name}
                    </span>
                    {isAccused && (
                      <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-1.5 py-0.2 rounded font-bold">
                        متهم
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-zinc-500 my-1">
                    {player.isStoryteller ? 'مشرف المجلس (يمتلك الحسم)' : 'عضو يحق له رفع اليد'}
                  </div>

                  {/* Individual Voting Hand Toggles */}
                  <div className="pt-2 border-t border-zinc-800/70 flex items-center gap-1.5 justify-end">
                    <button
                      onClick={() => {
                        sound.playReadyChime();
                        onVotePlayer(player.id, 'innocent');
                      }}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                        player.voteChoice === 'innocent'
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-zinc-950 text-zinc-400 hover:text-emerald-400 border border-zinc-800'
                      }`}
                      title="تصويت بريء"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>عفو</span>
                    </button>

                    <button
                      onClick={() => {
                        sound.playGavel();
                        onVotePlayer(player.id, 'guilty');
                      }}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                        player.voteChoice === 'guilty'
                          ? 'bg-rose-600 text-white font-bold'
                          : 'bg-zinc-950 text-zinc-400 hover:text-rose-400 border border-zinc-800'
                      }`}
                      title="تصويت إدانة"
                    >
                      <XCircle className="w-3 h-3" />
                      <span>إعدام</span>
                    </button>

                    <button
                      onClick={() => {
                        onVotePlayer(player.id, 'abstain');
                      }}
                      className={`px-1.5 py-1 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                        player.voteChoice === 'abstain' || !player.voteChoice
                          ? 'text-zinc-500 font-medium'
                          : 'text-zinc-600 hover:text-zinc-400'
                      }`}
                      title="امتناع"
                    >
                      امتناع
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Council Law Codex */}
          <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 text-xs text-zinc-400 space-y-1.5">
            <div className="text-zinc-300 font-semibold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>ميثاق العدالة في مجلس الغسق</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              - يحق للمتهم التحدث والدفاع عن نفسه حتى انتهاء مؤقت الجلسة.
              <br />
              - يحتاج حكم الإعدام إلى 5 أصوات مؤيدة على الأقل من الأحياء.
              <br />
              - في حال تعادل الأصوات أو تفعيل قرار العفو، تعود الجلسة للغسق وتخصيص قدرات العفريت.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
