export type ScreenId =
  | 'waiting-hall'
  | 'role-distribution'
  | 'demon-customization'
  | 'day-phase';

export type TransitionType = 'push' | 'push_back' | 'none';

export type Alignment = 'town' | 'outsider' | 'minion' | 'demon';

export interface RoleCard {
  id: string;
  name: string;
  alignment: Alignment;
  alignmentLabel: string;
  category: 'خير' | 'شر' | 'محايد';
  description: string;
  iconName: string;
  image?: string;
  isFirstNight: boolean;
  nightOrder: number;
}

export interface Player {
  id: string;
  name: string;
  avatarSeed: string;
  isReady: boolean;
  isStoryteller: boolean;
  isAlive: boolean;
  hasGhostVote: boolean;
  assignedRole?: RoleCard;
  revealed: boolean;
  voteChoice?: 'innocent' | 'guilty' | 'abstain';
}

export interface DemonAbility {
  id: string;
  name: string;
  cost: string;
  description: string;
  cooldown: string;
  isActive: boolean;
  icon: string;
}

export interface TrialState {
  accusedPlayerId: string;
  accuserPlayerId: string;
  accusationReason: string;
  votesNeeded: number;
  timerSeconds: number;
  timerRunning: boolean;
  verdict: 'none' | 'pardoned' | 'executed';
}
