import React from 'react';
import { Box, Text, Newline } from 'ink';
import type { Map as GameMap, World, Position } from '@atsu/choukai';
import type { BaseUnit } from '@atsu/atago';
import { MapRenderer } from './MapRenderer';

export interface IUnitPosition {
  unitId: string;
  mapId: string;
  position: Position;
}

export interface IGameRendererConfig {
  showUnitPositions?: boolean;
  selectedMap?: string | undefined;
}

interface GameRendererProps {
  world: World;
  units?: Record<string, BaseUnit>;
  config: IGameRendererConfig
}

export const GameRenderer: React.FC<GameRendererProps> = ({
  world,
  units = {},
  config = {}
}) => {
  const maps = world.getAllMaps();
  const mapsToRender = config.selectedMap
    ? maps.filter(map => map.name === config.selectedMap)
    : maps;

  return (
    <Box flexDirection="column" padding={1}>
      <Box flexDirection="row" justifyContent="space-between" marginBottom={1}>
        <Text bold color="cyan">Takao Engine - Game View</Text>
        <Text color="gray">{new Date().toLocaleTimeString()}</Text>
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
      {config.showUnitPositions &&
        Object.keys(units).length > 0 && (
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
        )}
    </Box>
  );
};