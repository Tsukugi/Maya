import type { Position } from '@atsu/choukai';

export interface IGameRendererConfig {
  showUnitPositions?: boolean;
  selectedMap?: string | undefined;
  showDiary?: boolean;
  diaryMaxEntries?: number;
  diaryTitle?: string;
  diaryMaxHeight?: number;
}

export interface IGameAction {
  id: string;
  playerId: string;
  type: string;
  description: string;
  timestamp: Date;
  success?: boolean;
  actionData?: any;
}

export interface DiaryEntry {
  turn: number;
  timestamp: string;
  action: {
    player: string;
    type: string;
    description: string;
    [key: string]: any;
  };
}

export interface IActionDiaryProps {
  diaryEntries: DiaryEntry[];
  maxEntries?: number;
  maxHeight?: number;
  title?: string;
}