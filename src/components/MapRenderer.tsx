import React, { useEffect, useState } from 'react';
import { Box, Text, Newline } from 'ink';
import type { Map as GameMap, Position } from '@atsu/choukai';

interface MapRendererProps {
  map: GameMap;
  unitNames?: Record<string, string>;
  unitPositions?: Record<string, { mapId: string; position: Position }>;
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
  unitNames = {},
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
          const unitId = map.getUnitAt(x, y);
          if (unitId) {
            const unitName = unitNames[unitId] || unitId;
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
  }, [map, unitNames, showCoordinates, cellWidth, showUnits, showTerrain, compactView]);

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