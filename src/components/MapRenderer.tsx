import React, { useMemo, memo } from 'react';
import { Box, Text, Newline } from 'ink';
import type { Map as GameMap, Position } from '@atsu/choukai';
import type { BaseUnit, IUnitPosition } from '@atsu/atago';

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
  desert: 'orange',
  road: 'gray',
  plains: 'cyan',
  swamp: 'magenta',
  snow: 'white',
  sand: 'yellow',
};

const UNIT_COLOR = 'yellow';

// Single text component for entire map rendering to reduce component overhead
export const MapRenderer: React.FC<MapRendererProps> = memo(({
  map,
  units = {},
  showCoordinates = true,
  cellWidth = 1,
  showUnits = true,
  showTerrain = true,
  compactView = true,
  useColors = true,
}) => {
  // Generate the entire map as a single string to reduce component overhead
  const mapDisplay = useMemo(() => {
    // Create a map of unit positions for efficient lookup
    const unitPositions = new Map<string, BaseUnit>();
    if (showUnits) {
      for (const unit of Object.values(units)) {
        const positionData = unit.getPropertyValue<IUnitPosition>('position');
        if (positionData && positionData.mapId === map.name) {
          const posKey = `${positionData.position.x},${positionData.position.y}`;
          unitPositions.set(posKey, unit);
        }
      }
    }

    const rows: Array<Array<{content: string, isUnit: boolean, terrain: string}>> = [];

    // Generate the map display
    for (let y = 0; y < map.height; y++) {
      const row: Array<{content: string, isUnit: boolean, terrain: string}> = [];

      if (showCoordinates) {
        const coordStr = y.toString().padStart(2, ' ');
        row.push({ content: compactView ? `${coordStr}|` : `${coordStr} |`, isUnit: false, terrain: 'grass' });
      }

      for (let x = 0; x < map.width; x++) {
        let cellContent = '';
        let isUnit = false;
        let terrainType = 'grass';

        // Efficiently check for a unit at this position
        if (showUnits) {
          const posKey = `${x},${y}`;
          const unitAtPosition = unitPositions.get(posKey);

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

      rows.push(row);
    }

    return rows;
  }, [map, units, showCoordinates, cellWidth, showUnits, showTerrain, compactView]); // Removed useColors to avoid unnecessary updates

  return (
    <Box flexDirection="column">
      <Text bold>{`Map: ${map.name} (${map.width}x${map.height})`}</Text>
      <Newline />
      {mapDisplay.map((row, rowIndex) => {
        // Group consecutive cells with the same color to reduce the number of Text components
        const segments = [];
        let currentSegment = '';
        let currentColor: string | undefined = undefined;
        let firstCell = true;

        for (const cellData of row) {
          const color = useColors
            ? (cellData.isUnit ? UNIT_COLOR : TERRAIN_COLORS[cellData.terrain])
            : undefined;

          if (firstCell || color !== currentColor) {
            if (!firstCell) {
              segments.push({ content: currentSegment, color: currentColor || undefined });
            }
            currentSegment = cellData.content;
            currentColor = color;
            firstCell = false;
          } else {
            currentSegment += cellData.content;
          }
        }

        // Add the last segment
        if (currentSegment) {
          segments.push({ content: currentSegment, color: currentColor });
        }

        return (
          <Box key={rowIndex} flexDirection="row">
            {segments.map((segment, segIndex) => (
              <Text key={segIndex} color={segment.color}>
                {segment.content}
              </Text>
            ))}
          </Box>
        );
      })}
    </Box>
  );
});