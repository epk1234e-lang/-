import React, { useState } from 'react';
import { ScreenId, TransitionType, Player, RoleCard, DemonAbility } from './types/game';
import { INITIAL_PLAYERS, INITIAL_ROLES, INITIAL_DEMON_ABILITIES } from './data/initialData';
import { TopBar } from './components/TopBar';
import { NavigationSidebar } from './components/NavigationSidebar';
import { ShareModal } from './components/ShareModal';
import { WaitingHallScreen } from './screens/WaitingHallScreen';
import { RoleDistributionScreen } from './screens/RoleDistributionScreen';
import { DemonCustomizationScreen } from './screens/DemonCustomizationScreen';
import { DayPhaseTrialScreen } from './screens/DayPhaseTrialScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('waiting-hall');
  const [transition, setTransition] = useState<TransitionType>('none');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Game state
  const [roomCode] = useState('TOWN-7749');
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [roles, setRoles] = useState<RoleCard[]>(INITIAL_ROLES);
  const [demonAbilities, setDemonAbilities] = useState<DemonAbility[]>(INITIAL_DEMON_ABILITIES);

  const handleNavigate = (targetScreen: ScreenId, transType: TransitionType) => {
    if (targetScreen === currentScreen) return;

    setTransition(transType);
    if (transType === 'none') {
      setCurrentScreen(targetScreen);
      return;
    }

    setIsTransitioning(true);
    setCurrentScreen(targetScreen);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 280);
  };

  const handleTogglePlayerReady = (playerId: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, isReady: !p.isReady } : p))
    );
  };

  const handleShuffleRoles = () => {
    setPlayers((prev) => {
      const shuffledRoles = [...roles].sort(() => Math.random() - 0.5);
      return prev.map((p, idx) => ({
        ...p,
        assignedRole: shuffledRoles[idx % shuffledRoles.length],
      }));
    });
  };

  const handleToggleDemonAbility = (abilityId: string) => {
    setDemonAbilities((prev) =>
      prev.map((a) => (a.id === abilityId ? { ...a, isActive: !a.isActive } : a))
    );
  };

  const handleVotePlayer = (playerId: string, choice: 'innocent' | 'guilty' | 'abstain') => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, voteChoice: choice } : p))
    );
  };

  const readyCount = players.filter((p) => p.isReady).length;

  // Transition style class helper
  const getTransitionClasses = () => {
    if (!isTransitioning || transition === 'none') return 'transition-all duration-200';
    if (transition === 'push') {
      return 'animate-in fade-in slide-in-from-left-6 duration-300 fill-mode-both';
    }
    if (transition === 'push_back') {
      return 'animate-in fade-in slide-in-from-right-6 duration-300 fill-mode-both';
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-rose-950 selection:text-rose-200">
      {/* Strict Top Bar Contract */}
      <TopBar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        roomCode={roomCode}
        onOpenShare={() => setIsShareOpen(true)}
      />

      {/* Main Layout: Aside Navigation + Active Screen Canvas */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Navigation Sidebar containing required xpath data-path links */}
        <NavigationSidebar
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          playerCount={players.length}
          readyCount={readyCount}
        />

        {/* Dynamic Screen View with Push / Push_Back / None transitions */}
        <main className={`flex-1 flex flex-col overflow-hidden ${getTransitionClasses()}`}>
          {currentScreen === 'waiting-hall' && (
            <WaitingHallScreen
              players={players}
              onTogglePlayerReady={handleTogglePlayerReady}
              onNavigate={handleNavigate}
              roomCode={roomCode}
              onOpenShare={() => setIsShareOpen(true)}
            />
          )}

          {currentScreen === 'role-distribution' && (
            <RoleDistributionScreen
              players={players}
              roles={roles}
              onShuffleRoles={handleShuffleRoles}
              onNavigate={handleNavigate}
            />
          )}

          {currentScreen === 'demon-customization' && (
            <DemonCustomizationScreen
              abilities={demonAbilities}
              onToggleAbility={handleToggleDemonAbility}
              players={players}
              onNavigate={handleNavigate}
            />
          )}

          {currentScreen === 'day-phase' && (
            <DayPhaseTrialScreen
              players={players}
              onNavigate={handleNavigate}
              onVotePlayer={handleVotePlayer}
            />
          )}
        </main>
      </div>

      {/* Mobile & Desktop Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        roomCode={roomCode}
      />
    </div>
  );
}
