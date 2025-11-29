import { render } from 'ink';
import type { Map as GameMap, World, Position } from '@atsu/choukai';
import { MapRenderer } from './components/MapRenderer';
import { GameRenderer } from './components/GameRenderer';

export { MapRenderer, GameRenderer };

interface IUnitPosition {
  unitId: string;
  mapId: string;
  position: Position;
}

// Convenience function to render a single map
export const renderMap = (
  map: GameMap,
  unitNames?: Record<string, string>,
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
      unitNames={unitNames}
      {...options}
    />
  );
  
  return waitUntilExit;
};

// Convenience function to render the entire game world
export const renderGame = (
  world: World,
  unitNames?: Record<string, string>,
  unitPositions?: Record<string, IUnitPosition>,
  selectedMap?: string
) => {
  const { waitUntilExit } = render(
    <GameRenderer
      world={world}
      unitNames={unitNames}
      unitPositions={unitPositions}
      selectedMap={selectedMap}
    />
  );
  
  return waitUntilExit;
};