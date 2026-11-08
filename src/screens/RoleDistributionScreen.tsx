import React, { useState } from 'react';
import { Player, RoleCard, ScreenId, TransitionType } from '../types/game';
import { sound } from '../utils/audio';
import {
  Shuffle,
  Eye,
  EyeOff,
  Flame,
  Search,
  Sparkles,
  Shield,
  Layers,
  Crown,
  Play,
  RotateCw,
} from 'lucide-react';

interface RoleDistributionScreenProps {
  players: Player[];
  roles: RoleCard[];
  onShuffleRoles: () => void;
  onNavigate: (screen: ScreenId, transition: TransitionType) => void;
}

export const RoleDistributionScreen: React.FC<RoleDistributionScreenProps> = ({
  players,
  roles,
  onShuffleRoles,
  onNavigate,
}) => {
  const [selectedRole, setSelectedRole] = useState<RoleCard | null>(roles[0]);
  const [revealedPlayerIds, setRevealedPlayerIds] = useState<Record<string, boolean>>({ p1: true });
  const [filterCategory, setFilterCategory] = useState<'all' | 'خير' | 'شر' | 'محايد'>('all');
  const [isShufflingAnimation, setIsShufflingAnimation] = useState(false);

  const toggleRevealPlayer = (playerId: string) => {
    sound.playCardShuffle();
    setRevealedPlayerIds((prev) => ({
      ...prev,
      [playerId]: !prev[playerId],
    }));
  };

  const handleShuffleClick = () => {
    sound.playCardShuffle();
    setIsShufflingAnimation(true);
    onShuffleRoles();
    setTimeout(() => {
      setIsShufflingAnimation(false);
      // Navigation requirement: shuffleBtn -> غرفة اللعبة وتخصيص البطاقات وقدرات العفريت (none transition)
      onNavigate('demon-customization', 'none');
    }, 400);
  };

  const handleStartRitualClick = () => {
    sound.playRitualBell();
    // Navigation requirement: startRitualBtn -> غرفة اللعبة ونظام التصويت بالنهار والمحاكمة (push transition)
    onNavigate('day-phase', 'push');
  };

  const filteredRoles =
    filterCategory === 'all' ? roles : roles.filter((r) => r.category === filterCategory);

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-500 font-medium mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>المرحلة التحضيرية • إسناد بطاقات المجلس</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-gothic text-zinc-100">
            توزيع بطاقات اللعبة وغرفة اللاعبين
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            وزّع بطاقات الهوية السرية بين الحضور في المجلس، وتأكد من توازن قوى الخير والشر.
          </p>
        </div>

        {/* Action Buttons with Required IDs */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {/* REQUIRED SPEC ELEMENT: //button[@id='shuffleBtn'] */}
          <button
            id="shuffleBtn"
            onClick={handleShuffleClick}
            className="px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm cursor-pointer hover:border-amber-500/50"
            title="إعادة خلط وتخصيص قدرات العفريت"
          >
            <Shuffle className={`w-4 h-4 text-amber-400 ${isShufflingAnimation ? 'animate-spin' : ''}`} />
            <span>إعادة خلط وتخصيص العفريت</span>
          </button>

          {/* REQUIRED SPEC ELEMENT: //button[@id='startRitualBtn'] */}
          <button
            id="startRitualBtn"
            onClick={handleStartRitualClick}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-zinc-950 text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-amber-950/40 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-zinc-950" />
            <span>بدء طقس الجلسة والانتقال للمحاكمة</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs for Roles */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-zinc-500 shrink-0">تصنيف الأدوار:</span>
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
            filterCategory === 'all'
              ? 'bg-amber-500 text-zinc-950 font-bold'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          جميع البطاقات ({roles.length})
        </button>
        <button
          onClick={() => setFilterCategory('خير')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
            filterCategory === 'خير'
              ? 'bg-blue-600 text-white font-bold'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          أهل القرية (خير)
        </button>
        <button
          onClick={() => setFilterCategory('شر')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
            filterCategory === 'شر'
              ? 'bg-rose-600 text-white font-bold'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          حلف العفريت (شر)
        </button>
        <button
          onClick={() => setFilterCategory('محايد')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
            filterCategory === 'محايد'
              ? 'bg-emerald-600 text-white font-bold'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          المعتزلون والمنبوذون
        </button>
      </div>

      {/* Main Grid: Card Gallery + Active Grimoire Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Player Cards Distribution Matrix (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-200 flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-500" />
              <span>مخطط توزيع البطاقات على اللاعبين الجالسين</span>
            </h2>
            <button
              onClick={() => {
                sound.playCardShuffle();
                const allRevealed = Object.keys(revealedPlayerIds).length === players.length;
                if (allRevealed) {
                  setRevealedPlayerIds({ p1: true });
                } else {
                  const all: Record<string, boolean> = {};
                  players.forEach((p) => (all[p.id] = true));
                  setRevealedPlayerIds(all);
                }
              }}
              className="text-xs text-amber-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>تبديل كشف جميع البطاقات</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {players.map((player) => {
              const isRevealed = !!revealedPlayerIds[player.id];
              const role = player.assignedRole;

              return (
                <div
                  key={player.id}
                  onClick={() => {
                    if (role) setSelectedRole(role);
                    toggleRevealPlayer(player.id);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[140px] ${
                    isRevealed
                      ? role?.category === 'شر'
                        ? 'bg-rose-950/30 border-rose-800/60 hover:border-rose-500'
                        : 'bg-zinc-900/90 border-zinc-700/80 hover:border-amber-500/60'
                      : 'bg-zinc-950 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-zinc-300 truncate max-w-[120px]">
                      {player.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRevealPlayer(player.id);
                      }}
                      className="text-zinc-500 hover:text-amber-400 p-1"
                    >
                      {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {isRevealed && role ? (
                    <div className="space-y-1.5 my-auto">
                      <div className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                        {role.category === 'شر' ? (
                          <Flame className="w-4 h-4 text-rose-500 shrink-0" />
                        ) : (
                          <Shield className="w-4 h-4 text-blue-400 shrink-0" />
                        )}
                        <span className="truncate">{role.name}</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 line-clamp-2">
                        {role.description}
                      </div>
                    </div>
                  ) : (
                    <div className="my-auto text-center py-3">
                      <div className="text-zinc-600 text-xs font-medium">بطاقة سرية مغلقة</div>
                      <div className="text-[10px] text-zinc-500 mt-1">انقر لكشف الهوية</div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500">
                    <span>{player.isStoryteller ? 'الراوي المشرف' : 'لاعب'}</span>
                    <span className="font-mono">{isRevealed ? role?.category : 'مجهول'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Card Inspection (1 col) */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-zinc-200 flex items-center gap-2">
            <Search className="w-4 h-4 text-amber-500" />
            <span>تفاصيل البطاقة المحددة</span>
          </h2>

          {selectedRole && (
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/90 space-y-4 shadow-xl">
              {/* Card visual showcase if image exists */}
              {selectedRole.image && (
                <div className="relative rounded-xl overflow-hidden border border-zinc-700 aspect-square max-h-56 mx-auto bg-zinc-950">
                  <img
                    src={selectedRole.image}
                    alt={selectedRole.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent p-3 text-right">
                    <span className="text-[11px] font-semibold text-amber-300">
                      {selectedRole.alignmentLabel}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-bold font-gothic text-amber-400">
                    {selectedRole.name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-semibold ${
                      selectedRole.category === 'شر'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-blue-950 text-blue-300 border border-blue-800'
                    }`}
                  >
                    {selectedRole.category}
                  </span>
                </div>
                <div className="text-xs text-zinc-500">{selectedRole.alignmentLabel}</div>
              </div>

              <div className="p-3 bg-zinc-950/70 rounded-xl border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
                {selectedRole.description}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 bg-zinc-950/50 rounded-lg border border-zinc-800/80">
                  <span className="text-zinc-500 block text-[11px]">ترتيب الاستيقاظ ليلاً</span>
                  <span className="font-semibold text-zinc-200">
                    {selectedRole.nightOrder > 0 ? `المرتبة #${selectedRole.nightOrder}` : 'لا يستيقظ ليلاً'}
                  </span>
                </div>
                <div className="p-2.5 bg-zinc-950/50 rounded-lg border border-zinc-800/80">
                  <span className="text-zinc-500 block text-[11px]">الليلة الأولى فقط</span>
                  <span className="font-semibold text-zinc-200">
                    {selectedRole.isFirstNight ? 'نعم (استيقاظ تمهيدي)' : 'مستمر طوال اللعبة'}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    sound.playCardShuffle();
                    // Customization shortcut
                    onNavigate('demon-customization', 'none');
                  }}
                  className="w-full py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-zinc-700"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>تخصيص قدرات وأدوار الخداع للعفريت</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
