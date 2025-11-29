import React from 'react';
import { Box, Text, Newline } from 'ink';
import type { Map as GameMap, World, Position } from '@atsu/choukai';
import { MapRenderer } from './MapRenderer';

interface IUnitPosition {
  unitId: string;
  mapId: string;
  position: Position;
}

interface GameRendererProps {
  world: World;
  unitNames?: Record<string, string>;
  unitPositions?: Record<string, IUnitPosition>;
  selectedMap?: string;
}

export const GameRenderer: React.FC<GameRendererProps> = ({
  world,
  unitNames = {},
  unitPositions = {},
  selectedMap,
}) => {
  const maps = world.getAllMaps();
  const mapsToRender = selectedMap 
    ? maps.filter(map => map.name === selectedMap)
    : maps;

  // Create unit mapping for each map
  const createUnitMap = (map: GameMap): Record<string, string> => {
    const mapUnits: Record<string, string> = {};
    
    Object.entries(unitNames).forEach(([unitId, name]) => {
      const pos = unitPositions[unitId];
      if (pos && pos.mapId === map.name) {
        mapUnits[unitId] = name;
      }
    });
    
    return mapUnits;
  };

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
              unitNames={createUnitMap(map)}
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
      {Object.keys(unitPositions).length > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text bold>Unit Positions:</Text>
          {Object.entries(unitPositions).map(([unitId, posInfo]) => {
            const unitName = unitNames[unitId] || unitId;
            return (
              <Text key={unitId}>
                {unitName} ({unitId.substring(0, 8)}...) at {posInfo.mapId} ({posInfo.position.x}, {posInfo.position.y})
              </Text>
            );
          })}
        </Box>
      )}
    </Box>
  );
};