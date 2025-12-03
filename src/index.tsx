import { render } from 'ink';
import type { Map as GameMap, World, Position } from '@atsu/choukai';
import type { BaseUnit, IUnitPosition } from '@atsu/atago';
import { MapRenderer } from './components/MapRenderer';
import { GameRenderer } from './components/GameRenderer';
import { ActionDiary } from './components/ActionDiary';
import type { IGameRendererConfig, DiaryEntry } from './types';

export { MapRenderer, GameRenderer, ActionDiary, IGameRendererConfig };

// Convenience function to render a single map
export const renderMap = (
  map: GameMap,
  units?: Record<string, BaseUnit>,
  options?: {
    showCoordinates?: boolean;
    cellWidth?: number;
    showUnits?: boolean;
    showTerrain?: boolean;
    compactView?: boolean;
    useColors?: boolean;
  }
) => {
  const { waitUntilExit } = render(
    <MapRenderer
      map={map}
      units={units}
      {...options}
    />
  );

  return waitUntilExit;
};

// Convenience function to render the entire game world
export const renderGame = (
  world: World,
  units?: Record<string, BaseUnit>,
  config: IGameRendererConfig = {},
  diaryEntries?: DiaryEntry[]
) => {
  const { waitUntilExit } = render(
    <GameRenderer
      world={world}
      units={units}
      diaryEntries={diaryEntries}
      config={config}
    />
  );

  return waitUntilExit;
};