import React, { memo, useMemo } from 'react';
import { Box, Text, Newline } from 'ink';
import type { Map as GameMap, World, Position } from '@atsu/choukai';
import type { BaseUnit, IUnitPosition } from '@atsu/atago';
import { MapRenderer } from './MapRenderer';
import type { IGameRendererConfig } from '../types';

interface GameRendererProps {
  world: World;
  units?: Record<string, BaseUnit>;
  config: IGameRendererConfig
}

// Memoized unit positions display
const UnitPositionsDisplay = memo(({ units, showUnitPositions }: {
  units: Record<string, BaseUnit>,
  showUnitPositions?: boolean
}) => {
  if (!showUnitPositions || Object.keys(units).length === 0) {
    return null;
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text bold>Unit Positions:</Text>
      {Object.entries(units).map(([unitId, unit]) => {
        const positionData = unit.getPropertyValue('position');
        if (positionData) {
          const unitName = unit.name || unitId;
          return (
            <Text key={unitId}>
              {unitName} ({unitId.substring(0, 8)}...) at {positionData.mapId} ({positionData.position.x}, {positionData.position.y})
            </Text>
          );
        }
        return null;
      }).filter(Boolean)}
    </Box>
  );
});

export const GameRenderer: React.FC<GameRendererProps> = memo(({
  world,
  units = {},
  config = {}
}) => {
  // Memoize the maps to render to prevent unnecessary recalculations
  const mapsToRender = useMemo(() => {
    const maps = world.getAllMaps();
    return config.selectedMap
      ? maps.filter(map => map.name === config.selectedMap)
      : maps;
  }, [world, config.selectedMap]);

  return (
    <Box flexDirection="column" padding={1}>
      <Box flexDirection="row" justifyContent="space-between" marginBottom={1}>
        <Text bold color="cyan">Takao Engine - Game View</Text>
        {/* Remove the constantly updating time to reduce flickering */}
        {/* <Text color="gray">{new Date().toLocaleTimeString()}</Text> */}
      </Box>

      {mapsToRender.length === 0 ? (
        <Text color="yellow">No maps available</Text>
      ) : (
        mapsToRender.map((map, index) => (
          <Box key={map.name} flexDirection="column" marginBottom={2}>
            <MapRenderer
              map={map}
              units={units}
              showCoordinates={true}
              cellWidth={1}
              showUnits={true}
              showTerrain={true}
              compactView={true}
              useColors={true}
            />

            {index < mapsToRender.length - 1 && <Newline />}
          </Box>
        ))
      )}
      {/* Unit positions summary */}
      <UnitPositionsDisplay units={units} showUnitPositions={config.showUnitPositions} />
    </Box>
  );
});