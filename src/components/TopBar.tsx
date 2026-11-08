import React from 'react';
import { ScreenId, TransitionType } from '../types/game';
import { sound } from '../utils/audio';

interface TopBarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId, transition: TransitionType) => void;
  roomCode: string;
  onOpenShare: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ currentScreen, onNavigate, roomCode, onOpenShare }) => {
  const getNavTransition = (target: ScreenId): TransitionType => {
    if (currentScreen === 'waiting-hall') return 'push';
    if (currentScreen === 'day-phase') return 'push_back';
    if (currentScreen === 'demon-customization' && target === 'role-distribution') return 'none';
    if (currentScreen === 'role-distribution' && target === 'waiting-hall') return 'push_back';
    return 'push';
  };

  return (
    <header className="flex items-center justify-between gap-4 md:gap-8 px-4 md:px-6 py-3 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          sound.playRitualBell();
          onNavigate('waiting-hall', 'push_back');
        }}
        className="text-lg md:text-xl font-bold tracking-tight text-amber-500 font-gothic hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
      >
        مجلس العفريت
      </a>

      {/* Zone 2: 4 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
        <button
          onClick={() => onNavigate('waiting-hall', getNavTransition('waiting-hall'))}
          className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentScreen === 'waiting-hall' ? 'text-amber-400 font-semibold underline underline-offset-8' : ''
          }`}
        >
          غرفة الانتظار
        </button>
        <button
          onClick={() => onNavigate('role-distribution', getNavTransition('role-distribution'))}
          className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentScreen === 'role-distribution' ? 'text-amber-400 font-semibold underline underline-offset-8' : ''
          }`}
        >
          توزيع البطاقات
        </button>
        <button
          onClick={() => onNavigate('demon-customization', getNavTransition('demon-customization'))}
          className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentScreen === 'demon-customization' ? 'text-amber-400 font-semibold underline underline-offset-8' : ''
          }`}
        >
          قدرات العفريت
        </button>
        <button
          onClick={() => onNavigate('day-phase', getNavTransition('day-phase'))}
          className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentScreen === 'day-phase' ? 'text-amber-400 font-semibold underline underline-offset-8' : ''
          }`}
        >
          المحاكمة بالنهار
        </button>
      </nav>

      {/* Zone 3: 1 primary action - Share Council */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <button
          onClick={() => {
            sound.playReadyChime();
            onOpenShare();
          }}
          className="px-3 md:px-4 py-2 text-xs font-semibold text-zinc-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm flex items-center gap-1.5"
          title="مشاركة الرابط للعب بالجوال"
        >
          <span>مشاركة الرابط للجوال</span>
        </button>
      </div>
    </header>
  );
};
