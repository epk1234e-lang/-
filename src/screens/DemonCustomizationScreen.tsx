import React, { useState } from 'react';
import { DemonAbility, Player, ScreenId, TransitionType } from '../types/game';
import { sound } from '../utils/audio';
import { DEMON_IMP_IMG, DEMON_BLUFF_ROLES } from '../data/initialData';
import {
  Flame,
  ShieldAlert,
  Ghost,
  Skull,
  Lock,
  Play,
  Layers,
  Sparkles,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface DemonCustomizationScreenProps {
  abilities: DemonAbility[];
  onToggleAbility: (abilityId: string) => void;
  players: Player[];
  onNavigate: (screen: ScreenId, transition: TransitionType) => void;
}

export const DemonCustomizationScreen: React.FC<DemonCustomizationScreenProps> = ({
  abilities,
  onToggleAbility,
  players,
  onNavigate,
}) => {
  const [bluffCards, setBluffCards] = useState(DEMON_BLUFF_ROLES);
  const [selectedVictimId, setSelectedVictimId] = useState<string>('p2');
  const [minionRole, setMinionRole] = useState<'scarlet-woman' | 'baron'>('scarlet-woman');

  const handleStartRitualClick = () => {
    sound.playRitualBell();
    // Navigation requirement: startRitualBtn -> غرفة اللعبة ونظام التصويت بالنهار والمحاكمة (push transition)
    onNavigate('day-phase', 'push');
  };

  const victimPlayer = players.find((p) => p.id === selectedVictimId);

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
      {/* Header with Title and Start Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-rose-500 font-medium mb-1">
            <Flame className="w-3.5 h-3.5" />
            <span>مجلس الظلال • إعدادات العفريت والتضليل</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-gothic text-zinc-100">
            غرفة اللعبة وتخصيص البطاقات وقدرات العفريت
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            اضبط بطاقات التمويه الثلاث المتاحة للعفريت، واختر القدرات الشيطانية النشطة قبل استدعاء جلسة
            النهار ومحاكمة المشتبه بهم.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              sound.playCardShuffle();
              onNavigate('role-distribution', 'none');
            }}
            className="px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4 text-amber-500" />
            <span>العودة لتوزيع البطاقات</span>
          </button>

          {/* REQUIRED SPEC ELEMENT: //button[@id='startRitualBtn'] */}
          <button
            id="startRitualBtn"
            onClick={handleStartRitualClick}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-rose-950/40 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>بدء طقس الجلسة والانتقال للمحاكمة</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Imp Character Showcase & Abilities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Demon Portrait Card & Night Victim Selector (1 col) */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border border-rose-900/40 bg-zinc-900/90 space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-rose-600 to-amber-500" />

            {/* Generated Imp Card Image */}
            <div className="relative rounded-xl overflow-hidden border border-rose-800/60 aspect-square max-h-64 mx-auto bg-zinc-950">
              <img
                src={DEMON_IMP_IMG}
                alt="العفريت - زعيم الظلال"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent p-3 text-right">
                <span className="text-xs font-bold text-rose-400">العفريت الأكبر • The Imp</span>
              </div>
            </div>

            <div className="space-y-1 text-center">
              <h2 className="text-xl font-bold font-gothic text-rose-300">
                سيد الليل ورأس المؤامرة
              </h2>
              <p className="text-xs text-zinc-400">
                يمتلك القدرة على زرع الخداع في قلوب أهل القرية واغتيال صوت الحقيقة ليلاً.
              </p>
            </div>

            {/* Night Kill Target Preview */}
            <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
                  <Skull className="w-3.5 h-3.5" />
                  هدف الاغتيال الليلي المختار
                </span>
                <span className="font-mono text-zinc-500">ضحية الليلة 1</span>
              </div>

              <select
                value={selectedVictimId}
                onChange={(e) => {
                  sound.playReadyChime();
                  setSelectedVictimId(e.target.value);
                }}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                {players
                  .filter((p) => p.assignedRole?.category !== 'شر')
                  .map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name} — {player.assignedRole?.name || 'قروي'}
                    </option>
                  ))}
              </select>

              {victimPlayer && (
                <div className="text-[11px] text-zinc-500 flex items-center gap-1 pt-1">
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                  <span>
                    إذا لم يُنقذه الراهب، سيبدأ النهار القادم وهو في عداد الموتى وتصويت الأشباح.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Minions Link Box */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/70 space-y-3">
            <span className="text-xs font-semibold text-zinc-300 block">
              خادم العفريت المرافق في المجلس
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setMinionRole('scarlet-woman')}
                className={`p-2.5 rounded-lg border text-right transition-all cursor-pointer ${
                  minionRole === 'scarlet-woman'
                    ? 'bg-rose-950/40 border-rose-500/60 text-rose-300 font-bold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                }`}
              >
                <div className="text-xs">المرأة القرمزية</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">ترث دور العفريت إن أُعدم</div>
              </button>

              <button
                onClick={() => setMinionRole('baron')}
                className={`p-2.5 rounded-lg border text-right transition-all cursor-pointer ${
                  minionRole === 'baron'
                    ? 'bg-rose-950/40 border-rose-500/60 text-rose-300 font-bold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                }`}
              >
                <div className="text-xs">البارون الملعون</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">يضيف منبوذين للمجلس</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Demon Abilities & Bluff Roles (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section A: Active Demon Powers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-zinc-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>القدرات الشيطانية المتاحة للعفريت</span>
              </h2>
              <span className="text-xs text-zinc-500">انقر لتبديل تفعيل أو كتم القدرة</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {abilities.map((ability) => (
                <div
                  key={ability.id}
                  onClick={() => {
                    sound.playReadyChime();
                    onToggleAbility(ability.id);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    ability.isActive
                      ? 'bg-zinc-900/95 border-rose-800/70 hover:border-rose-500 shadow-md'
                      : 'bg-zinc-950/70 border-zinc-800/80 opacity-60 hover:opacity-90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-2 rounded-lg ${
                          ability.isActive
                            ? 'bg-rose-950/80 text-rose-400 border border-rose-800'
                            : 'bg-zinc-900 text-zinc-600'
                        }`}
                      >
                        {ability.id === 'shadowstep' && <Ghost className="w-4 h-4" />}
                        {ability.id === 'night_kill' && <Skull className="w-4 h-4" />}
                        {ability.id === 'dark_whisper' && <ShieldAlert className="w-4 h-4" />}
                        {ability.id === 'curse_paralysis' && <Lock className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-zinc-200">{ability.name}</div>
                        <div className="text-[11px] text-zinc-500">{ability.cost}</div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        ability.isActive
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                      }`}
                    >
                      {ability.isActive ? 'مفعلة' : 'معطلة'}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed my-2">
                    {ability.description}
                  </p>

                  <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
                    <span>مهلة الاستخدام:</span>
                    <span className="font-mono text-zinc-300">{ability.cooldown}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section B: Demon Bluff Cards (3 False Town Cards) */}
          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>بطاقات التمويه الثلاث الممنوحة للعفريت (Demon Bluffs)</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  هذه الأدوار غير موجودة في الجلسة الفعلية، ويستخدمها العفريت لادّعاء الصدق أمام مجلس
                  المحاكمة.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {bluffCards.map((bluff, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 hover:border-amber-500/40 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">{bluff.name}</span>
                    <span className="text-[10px] bg-amber-950/60 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800/40">
                      غطاء #{idx + 1}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{bluff.hint}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
