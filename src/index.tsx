import { render } from 'ink';
import type { Map as GameMap, World, Position } from '@atsu/choukai';
import type { BaseUnit } from '@atsu/atago';
import { MapRenderer } from './components/MapRenderer';
import { GameRenderer, IGameRendererConfig } from './components/GameRenderer';

export { MapRenderer, GameRenderer };

interface IUnitPosition {
  unitId: string;
  mapId: string;
  position: Position;
}

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
  config: IGameRendererConfig = {}
) => {
  const { waitUntilExit } = render(
    <GameRenderer
      world={world}
      units={units}
      config={config}
    />
  );

  return waitUntilExit;
};