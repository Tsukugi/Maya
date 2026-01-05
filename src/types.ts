import type { Position } from '@atsu/choukai';

export interface IGameRendererConfig {
  showUnitPositions?: boolean;
  selectedMap?: string | undefined;
  showDiary?: boolean;
  diaryMaxEntries?: number;
  diaryTitle?: string;
  diaryMaxHeight?: number;
  mapWidthPercentage?: number;
  diaryWidthPercentage?: number;
  minDiaryWidth?: number;
  maxDiaryWidth?: number | string;
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
  };
  statChanges?: Array<{
    unitId: string;
    unitName: string;
    propertyName: string;
    oldValue: unknown;
    newValue: unknown;
  }>;
  statChangesSummary?: string[];
  statChangesByUnit?: Record<string, string[]>;
  statChangesFormatted?: Array<{
    unit: string;
    changes: string[];
  }>;
}

export interface IActionDiaryProps {
  diaryEntries: DiaryEntry[];
  maxEntries?: number;
  maxHeight?: number;
  title?: string;
  availableWidth?: number;
}
