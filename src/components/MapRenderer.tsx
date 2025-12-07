import React, { useMemo } from 'react';
import { Box, Text, Newline } from 'ink';
import type { Map as GameMap } from '@atsu/choukai';
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

type RenderCell = { content: string; isUnit: boolean; terrain: string };

const buildUnitsSignature = (units: Record<string, BaseUnit>): string => {
  const signatures = Object.values(units).map(unit => {
    const positionData = unit.getPropertyValue<IUnitPosition>('position');
    if (!positionData) {
      return `${unit.id}:none`;
    }

    const { mapId, position } = positionData;
    const x = position?.x ?? 'n';
    const y = position?.y ?? 'n';
    return `${unit.id}:${mapId ?? 'unknown'}:${x},${y}`;
  });

  return signatures.sort().join('|');
};

const buildUnitPositionMap = (units: Record<string, BaseUnit>, mapName: string, showUnits: boolean) => {
  const unitPositions = new Map<string, BaseUnit>();
  if (!showUnits) {
    return unitPositions;
  }

  for (const unit of Object.values(units)) {
    const positionData = unit.getPropertyValue<IUnitPosition>('position');
    if (positionData && positionData.mapId === mapName) {
      const posKey = `${positionData.position.x},${positionData.position.y}`;
      unitPositions.set(posKey, unit);
    }
  }

  return unitPositions;
};

const buildRowPrefix = (rowIndex: number, showCoordinates: boolean, compactView: boolean): RenderCell[] => {
  if (!showCoordinates) {
    return [];
  }
  const coordStr = rowIndex.toString().padStart(2, ' ');
  return [
    { content: compactView ? `${coordStr}|` : `${coordStr} |`, isUnit: false, terrain: 'grass' },
  ];
};

const renderCellContent = (
  x: number,
  y: number,
  map: GameMap,
  unitPositions: Map<string, BaseUnit>,
  { showUnits, showTerrain, cellWidth, compactView }: { showUnits: boolean; showTerrain: boolean; cellWidth: number; compactView: boolean; }
): RenderCell => {
  let content = '';
  let isUnit = false;
  let terrainType = 'grass';

  if (showUnits) {
    const unitAtPosition = unitPositions.get(`${x},${y}`);
    if (unitAtPosition) {
      const unitName = unitAtPosition.name || unitAtPosition.id;
      content = unitName.charAt(0).toUpperCase();
      isUnit = true;
    }
  }

  if (!content && showTerrain) {
    const cell = map.getCell(x, y);
    terrainType = cell?.terrain || 'grass';
    content = TERRAIN_SYMBOLS[terrainType] || '?';
  }

  if (cellWidth > 1) {
    content = content.padEnd(cellWidth, ' ');
  } else if (!compactView) {
    content += ' ';
  }

  return { content, isUnit, terrain: terrainType };
};

const groupSegments = (row: RenderCell[], useColors: boolean) => {
  const segments: Array<{ content: string; color?: string }> = [];
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

  if (currentSegment) {
    segments.push({ content: currentSegment, color: currentColor });
  }

  return segments;
};

// Single text component for entire map rendering to reduce component overhead
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
  const unitsSignature = buildUnitsSignature(units);

  // Build the map rows as simple arrays of renderable cells
  const mapDisplay = useMemo(() => {
    const unitPositions = buildUnitPositionMap(units, map.name, showUnits);
    const rows: RenderCell[][] = [];

    for (let y = 0; y < map.height; y++) {
      const row: RenderCell[] = [
        ...buildRowPrefix(y, showCoordinates, compactView),
      ];

      for (let x = 0; x < map.width; x++) {
        row.push(
          renderCellContent(x, y, map, unitPositions, {
            showUnits,
            showTerrain,
            cellWidth,
            compactView,
          })
        );
      }

      rows.push(row);
    }

    return rows;
  }, [map, unitsSignature, showCoordinates, cellWidth, showUnits, showTerrain, compactView]); // Removed useColors to avoid unnecessary updates

  return (
    <Box flexDirection="column">
      <Text bold>{`Map: ${map.name} (${map.width}x${map.height})`}</Text>
      <Newline />
      {mapDisplay.map((row, rowIndex) => {
        const segments = groupSegments(row, useColors);

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
};
