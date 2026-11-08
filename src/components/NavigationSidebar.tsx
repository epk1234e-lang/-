import React from 'react';
import { ScreenId, TransitionType } from '../types/game';
import { sound } from '../utils/audio';
import { Users, Layers, Flame, Gavel, Bell, Shield, Volume2 } from 'lucide-react';

interface NavigationSidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId, transition: TransitionType) => void;
  playerCount: number;
  readyCount: number;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  currentScreen,
  onNavigate,
  playerCount,
  readyCount,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, target: ScreenId) => {
    e.preventDefault();
    sound.playCardShuffle();

    if (currentScreen === 'waiting-hall') {
      if (target === 'role-distribution') {
        onNavigate('role-distribution', 'push');
      } else if (target === 'day-phase') {
        onNavigate('day-phase', 'push');
      } else if (target === 'demon-customization') {
        onNavigate('demon-customization', 'push');
      }
    } else if (currentScreen === 'role-distribution') {
      if (target === 'waiting-hall') {
        onNavigate('waiting-hall', 'push_back');
      } else if (target === 'day-phase') {
        onNavigate('day-phase', 'push');
      } else if (target === 'demon-customization') {
        onNavigate('demon-customization', 'none');
      }
    } else if (currentScreen === 'demon-customization') {
      if (target === 'waiting-hall') {
        onNavigate('waiting-hall', 'push_back');
      } else if (target === 'day-phase') {
        onNavigate('day-phase', 'push');
      } else if (target === 'role-distribution') {
        onNavigate('role-distribution', 'none');
      }
    } else if (currentScreen === 'day-phase') {
      if (target === 'waiting-hall') {
        onNavigate('waiting-hall', 'push_back');
      } else if (target === 'role-distribution') {
        onNavigate('role-distribution', 'push_back');
      } else if (target === 'demon-customization') {
        onNavigate('demon-customization', 'push_back');
      }
    }
  };

  return (
    <aside className="w-full md:w-64 shrink-0 bg-zinc-950/80 border-b md:border-b-0 md:border-l border-zinc-800/80 flex flex-col justify-between p-3 md:p-4 md:min-h-[calc(100vh-53px)] select-none">
      <div className="space-y-4 md:space-y-6">
        {/* Storyteller header badge - hidden on small mobile, visible on desktop/tablet */}
        <div className="hidden md:block p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/70">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>منصب الراوي</span>
            <span className="text-emerald-400 font-medium">متصل</span>
          </div>
          <div className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-500" />
            <span>مجلس بلدة الغسق</span>
          </div>
          <div className="text-xs text-zinc-500 mt-2 flex items-center justify-between border-t border-zinc-800/50 pt-2">
            <span>جاهزية اللاعبين:</span>
            <span className="font-mono text-amber-400 font-semibold">
              {readyCount} / {playerCount}
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div>
          <div className="hidden md:block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2 px-2">
            مسارات المجلس
          </div>
          <nav className="flex md:flex-col gap-1.5 md:space-y-1 overflow-x-auto pb-1 md:pb-0">
            {/* 1. Waiting Hall */}
            <a
              href="#waiting-hall"
              data-path="waiting-hall"
              onClick={(e) => handleClick(e, 'waiting-hall')}
              className={`flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 md:shrink ${
                currentScreen === 'waiting-hall'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
              }`}
            >
              <Users className="w-4 h-4 text-amber-500 shrink-0" />
              <div className="flex flex-col text-right">
                <span className="leading-tight">غرفة الانتظار</span>
                <span className="hidden md:inline text-[11px] text-zinc-500">انضمام وتأكيد الحضور</span>
              </div>
            </a>

            {/* 2. Role Distribution */}
            <a
              href="#role-distribution"
              data-path="role-distribution"
              onClick={(e) => handleClick(e, 'role-distribution')}
              className={`flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 md:shrink ${
                currentScreen === 'role-distribution'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-500 shrink-0" />
              <div className="flex flex-col text-right">
                <span className="leading-tight">توزيع البطاقات</span>
                <span className="hidden md:inline text-[11px] text-zinc-500">إسناد الأدوار وكشف البطاقات</span>
              </div>
            </a>

            {/* 3. Demon Customization */}
            <a
              href="#demon-customization"
              data-path="demon-customization"
              onClick={(e) => handleClick(e, 'demon-customization')}
              className={`flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 md:shrink ${
                currentScreen === 'demon-customization'
                  ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
              }`}
            >
              <Flame className="w-4 h-4 text-rose-500 shrink-0" />
              <div className="flex flex-col text-right">
                <span className="leading-tight">قدرات العفريت</span>
                <span className="hidden md:inline text-[11px] text-zinc-500">بطاقات التمويه والاغتيال</span>
              </div>
            </a>

            {/* 4. Day Phase & Trial */}
            <a
              href="#day-phase"
              data-path="day-phase"
              onClick={(e) => handleClick(e, 'day-phase')}
              className={`flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 md:shrink ${
                currentScreen === 'day-phase'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
              }`}
            >
              <Gavel className="w-4 h-4 text-amber-500 shrink-0" />
              <div className="flex flex-col text-right">
                <span className="leading-tight">المحاكمة والتصويت</span>
                <span className="hidden md:inline text-[11px] text-zinc-500">جلسة النهار وعفو أو إعدام</span>
              </div>
            </a>
          </nav>
        </div>

        {/* Ambient Gothic Sound Trigger - hidden on small mobile */}
        <div className="hidden md:block p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/50 space-y-2">
          <div className="text-xs text-zinc-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-amber-500" />
              صوتيات الطقوس
            </span>
            <button
              onClick={() => sound.playRitualBell()}
              className="text-[11px] text-amber-400 hover:underline cursor-pointer"
            >
              قرع الجرس
            </button>
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            مؤثرات جرس منتصف الليل، وخفقة البطاقات، ومطرقة القاضي تعمل تلقائياً مع أحداث الجلسة.
          </p>
        </div>
      </div>

      {/* Footer Info - hidden on mobile */}
      <div className="hidden md:flex pt-4 border-t border-zinc-800/60 text-xs text-zinc-500 items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Bell className="w-3 h-3 text-zinc-400" />
          نسخة الجلسة 1.0
        </span>
        <span className="text-[11px] text-zinc-600 font-mono">طراز برج الظلال</span>
      </div>
    </aside>
  );
};
