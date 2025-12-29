import React, { useMemo } from "react";
import { Box, Text, Newline, useStdout } from "ink";
import type { World } from "@atsu/choukai";
import type { BaseUnit, IUnitPosition } from "@atsu/atago";
import { isUnitPosition } from "@atsu/atago";
import { MapRenderer } from "./MapRenderer";
import { ActionDiary } from "./ActionDiary";
import type { IGameRendererConfig, DiaryEntry } from "../types";

interface GameRendererProps {
  world: World;
  units?: Record<string, BaseUnit>;
  diaryEntries?: DiaryEntry[];
  config: IGameRendererConfig;
}

export type DiaryLayout = {
  height: number | string;
  minWidth: number | string;
  maxWidth: number | string;
  flexBasis: string;
  approxWidth: number;
};

const computeDiaryApproxWidth = (
  terminalWidth: number,
  useColumnLayout: boolean,
  diaryWidthPercent: number,
  diaryMinWidth: number,
  diaryMaxWidth: number | string
) => {
  if (useColumnLayout) {
    return terminalWidth;
  }

  const widthByPercent = Math.floor(
    (terminalWidth - 4) * (diaryWidthPercent / 100)
  ); // account for padding/border
  const minApplied = Math.max(widthByPercent, diaryMinWidth);

  if (typeof diaryMaxWidth === "number") {
    return Math.min(minApplied, diaryMaxWidth);
  }

  if (typeof diaryMaxWidth === "string" && diaryMaxWidth.endsWith("%")) {
    const pct = Number(diaryMaxWidth.replace("%", ""));
    if (!Number.isNaN(pct)) {
      const byMaxPct = Math.floor((terminalWidth - 4) * (pct / 100));
      return Math.min(minApplied, byMaxPct);
    }
  }

  return minApplied;
};

export const resolveDiaryLayout = (
  config: IGameRendererConfig,
  terminalWidth: number,
  useColumnLayout: boolean
): DiaryLayout => {
  const diaryHeight = Math.min(config.diaryMaxHeight || 30, 50);

  const diaryMinWidth = config.minDiaryWidth || 50;
  const diaryMaxWidth = config.maxDiaryWidth || "60%";
  const diaryWidthPercent =
    config.diaryWidthPercentage !== undefined
      ? config.diaryWidthPercentage
      : 40;

  const diaryFlexBasis = `${diaryWidthPercent}%`;
  const diaryApproxWidth = computeDiaryApproxWidth(
    terminalWidth,
    useColumnLayout,
    diaryWidthPercent,
    diaryMinWidth,
    diaryMaxWidth
  );

  return {
    height: diaryHeight,
    minWidth: useColumnLayout ? "100%" : diaryMinWidth,
    maxWidth: useColumnLayout ? "100%" : diaryMaxWidth,
    flexBasis: useColumnLayout ? "0" : diaryFlexBasis,
    approxWidth: diaryApproxWidth,
  };
};

const UnitPositionsDisplay = ({
  units,
  showUnitPositions,
}: {
  units: Record<string, BaseUnit>;
  showUnitPositions?: boolean;
}) => {
  if (!showUnitPositions || Object.keys(units).length === 0) {
    return null;
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text bold>Unit Positions:</Text>
      {Object.entries(units)
        .map(([unitId, unit]) => {
          const positionData =
            unit.getPropertyValue<IUnitPosition>("position");
          if (!isUnitPosition(positionData)) {
            return null;
          }

          const unitName = unit.name || unitId;
          return (
            <Text key={unitId}>
              {unitName} ({unitId.substring(0, 8)}...) at {positionData.mapId} (
              {positionData.position.x}, {positionData.position.y})
            </Text>
          );
        })
        .filter(Boolean)}
    </Box>
  );
};

const shouldUseColumnLayout = (terminalWidth: number) => terminalWidth < 80;

const selectMapsToRender = (world: World, selectedMap?: string) => {
  const maps = world.getAllMaps();
  return selectedMap ? maps.filter((map) => map.name === selectedMap) : maps;
};

const getMapFlexBasis = (config: IGameRendererConfig) =>
  config.mapWidthPercentage !== undefined
    ? `${config.mapWidthPercentage}%`
    : "60%"; // Reduced from 70% to give more space to diary

export const GameRenderer: React.FC<GameRendererProps> = ({
  world,
  units = {},
  diaryEntries = [],
  config = {},
}) => {
  const { stdout } = useStdout();
  const terminalWidth = stdout.columns || 80; // Default to 80 if width is unavailable

  const useColumnLayout = shouldUseColumnLayout(terminalWidth);
  const mapsToRender = useMemo(
    () => selectMapsToRender(world, config.selectedMap),
    [world, config.selectedMap]
  );
  const mapFlexBasis = getMapFlexBasis(config);
  const diaryLayout = resolveDiaryLayout(
    config,
    terminalWidth,
    useColumnLayout
  );

  return (
    <Box
      flexDirection={useColumnLayout ? "column" : "row"}
      padding={1}
      height="100%"
    >
      {/* Left column (or top in column layout): Map renderer */}
      <Box
        flexDirection="column"
        flexGrow={useColumnLayout ? 1 : 1}
        flexShrink={1}
        flexBasis={useColumnLayout ? "0" : mapFlexBasis}
        paddingRight={useColumnLayout ? 0 : 1}
        paddingBottom={useColumnLayout ? 1 : 0}
        borderStyle="single"
        height={useColumnLayout ? "50%" : diaryLayout.height}
      >
        <Box
          flexDirection="row"
          justifyContent="space-between"
          marginBottom={1}
        >
          <Text bold color="cyan">
            Takao Engine - Game View
          </Text>
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

        {/* Unit positions display - still shown below the map */}
        <UnitPositionsDisplay
          units={units}
          showUnitPositions={config.showUnitPositions}
        />
      </Box>

      {/* Right column (or bottom in column layout): Action diary */}
      {config.showDiary !== false && (
        <Box
          flexDirection="column"
          flexGrow={useColumnLayout ? 0 : 1}
          flexShrink={1}
          flexBasis={diaryLayout.flexBasis}
          minWidth={diaryLayout.minWidth}
          maxWidth={diaryLayout.maxWidth}
          paddingLeft={useColumnLayout ? 0 : 1}
          paddingTop={useColumnLayout ? 1 : 0}
          borderStyle="single"
          height={useColumnLayout ? "50%" : diaryLayout.height}
        >
          <ActionDiary
            diaryEntries={diaryEntries}
            maxEntries={config.diaryMaxEntries || 20}
            maxHeight={config.diaryMaxHeight || 30}
            title={config.diaryTitle || "Action Diary"}
            availableWidth={diaryLayout.approxWidth}
          />
        </Box>
      )}
    </Box>
  );
};
