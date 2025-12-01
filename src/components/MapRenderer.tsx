import React, { useEffect, useState } from 'react';
import { Box, Text, Newline } from 'ink';
import type { Map as GameMap, Position } from '@atsu/choukai';
import type { BaseUnit } from '@atsu/atago';

interface IUnitPosition {
  unitId: string;
  mapId: string;
  position: Position;
}

interface MapRendererProps {
  map: GameMap;
  units?: Record<string, BaseUnit>;
  showCoordinates?: boolean;
  cellWidth?: number;
  showUnits?: boolean;
  showTerrain?: boolean;
  compactView?: boolean;
  useColors?: boolean;
}

const TERRAIN_SYMBOLS: Record<string, string> = {
  grass: '.',
  water: '~',
  mountain: '^',
  forest: 't',
  desert: '#',
  road: '=',
  plains: '.',
  swamp: ':',
  snow: '*',
  sand: '-',
};

const TERRAIN_COLORS: Record<string, string> = {
  grass: 'gray',
  water: 'blue',
  mountain: 'white',
  forest: 'green',
  desert: 'yellow',
  road: 'gray',
  plains: 'cyan',
  swamp: 'magenta',
  snow: 'white',
  sand: 'yellow',
};

const UNIT_COLOR = 'green';

export const MapRenderer: React.FC<MapRendererProps> = ({
  map,
  units = {},
  showCoordinates = true,
  cellWidth = 1,
  showUnits = true,
  showTerrain = true,
  compactView = true,
  useColors = true,
}) => {
  const [mapState, setMapState] = useState<{content: string, isUnit: boolean, terrain: string}[][]>([]);

  useEffect(() => {
    const updatedMap: {content: string, isUnit: boolean, terrain: string}[][] = [];

    // Generate the map display
    for (let y = 0; y < map.height; y++) {
      const row: {content: string, isUnit: boolean, terrain: string}[] = [];

      if (showCoordinates) {
        const coordStr = y.toString().padStart(2, ' ');
        row.push({ content: compactView ? `${coordStr}|` : `${coordStr} |`, isUnit: false, terrain: 'grass' });
      }

      for (let x = 0; x < map.width; x++) {
        let cellContent = '';
        let isUnit = false;
        let terrainType = 'grass';

        if (showUnits) {
          // Find a unit at this position by checking their stored positions
          const unitAtPosition = Object.values(units).find(unit => {
            const positionData = unit.getPropertyValue('position');
            return (
              positionData?.mapId === map.name &&
              positionData.position.x === x &&
              positionData.position.y === y
            );
          });

          if (unitAtPosition) {
            const unitName = unitAtPosition.name || unitAtPosition.id;
            cellContent = unitName.charAt(0).toUpperCase();
            isUnit = true;
          }
        }

        if (!cellContent && showTerrain) {
          const cell = map.getCell(x, y);
          terrainType = cell?.terrain || 'grass';
          cellContent = TERRAIN_SYMBOLS[terrainType] || '?';
        }

        // Pad the cell content to the desired width
        if (cellWidth > 1) {
          cellContent = cellContent.padEnd(cellWidth, ' ');
        } else if (!compactView) {
          cellContent += ' ';
        }

        row.push({ content: cellContent, isUnit, terrain: terrainType });
      }

      updatedMap.push(row);
    }

    setMapState(updatedMap);
  }, [map, units, showCoordinates, cellWidth, showUnits, showTerrain, compactView, useColors]);

  return (
    <Box flexDirection="column">
      <Text bold>{`Map: ${map.name} (${map.width}x${map.height})`}</Text>
      <Newline />
      {mapState.map((row, rowIndex) => (
        <Box key={rowIndex} flexDirection="row">
          {row.map((cellData, cellIndex) => {
            const color = useColors
              ? (cellData.isUnit ? UNIT_COLOR : TERRAIN_COLORS[cellData.terrain])
              : undefined;

            return (
              <Text key={cellIndex} color={color}>
                {cellData.content}
              </Text>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};