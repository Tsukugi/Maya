// src/index.tsx
import { render } from "ink";

// src/components/MapRenderer.tsx
import { useMemo, memo } from "react";
import { Box, Text, Newline } from "ink";
import { jsx, jsxs } from "react/jsx-runtime";
var TERRAIN_SYMBOLS = {
  grass: ".",
  water: "~",
  mountain: "^",
  forest: "t",
  desert: "#",
  road: "=",
  plains: ".",
  swamp: ":",
  snow: "*",
  sand: "-"
};
var TERRAIN_COLORS = {
  grass: "gray",
  water: "blue",
  mountain: "white",
  forest: "green",
  desert: "yellow",
  road: "gray",
  plains: "cyan",
  swamp: "magenta",
  snow: "white",
  sand: "yellow"
};
var UNIT_COLOR = "green";
var MapRenderer = memo(({
  map,
  units = {},
  showCoordinates = true,
  cellWidth = 1,
  showUnits = true,
  showTerrain = true,
  compactView = true,
  useColors = true
}) => {
  const mapDisplay = useMemo(() => {
    const unitPositions = /* @__PURE__ */ new Map();
    if (showUnits) {
      for (const unit of Object.values(units)) {
        const positionData = unit.getPropertyValue("position");
        if (positionData && positionData.mapId === map.name) {
          const posKey = `${positionData.position.x},${positionData.position.y}`;
          unitPositions.set(posKey, unit);
        }
      }
    }
    const rows = [];
    for (let y = 0; y < map.height; y++) {
      const row = [];
      if (showCoordinates) {
        const coordStr = y.toString().padStart(2, " ");
        row.push({ content: compactView ? `${coordStr}|` : `${coordStr} |`, isUnit: false, terrain: "grass" });
      }
      for (let x = 0; x < map.width; x++) {
        let cellContent = "";
        let isUnit = false;
        let terrainType = "grass";
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
          terrainType = cell?.terrain || "grass";
          cellContent = TERRAIN_SYMBOLS[terrainType] || "?";
        }
        if (cellWidth > 1) {
          cellContent = cellContent.padEnd(cellWidth, " ");
        } else if (!compactView) {
          cellContent += " ";
        }
        row.push({ content: cellContent, isUnit, terrain: terrainType });
      }
      rows.push(row);
    }
    return rows;
  }, [map, units, showCoordinates, cellWidth, showUnits, showTerrain, compactView]);
  return /* @__PURE__ */ jsxs(Box, { flexDirection: "column", children: [
    /* @__PURE__ */ jsx(Text, { bold: true, children: `Map: ${map.name} (${map.width}x${map.height})` }),
    /* @__PURE__ */ jsx(Newline, {}),
    mapDisplay.map((row, rowIndex) => {
      const segments = [];
      let currentSegment = "";
      let currentColor = void 0;
      let firstCell = true;
      for (const cellData of row) {
        const color = useColors ? cellData.isUnit ? UNIT_COLOR : TERRAIN_COLORS[cellData.terrain] : void 0;
        if (firstCell || color !== currentColor) {
          if (!firstCell) {
            segments.push({ content: currentSegment, color: currentColor || void 0 });
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
      return /* @__PURE__ */ jsx(Box, { flexDirection: "row", children: segments.map((segment, segIndex) => /* @__PURE__ */ jsx(Text, { color: segment.color, children: segment.content }, segIndex)) }, rowIndex);
    })
  ] });
});

// src/components/GameRenderer.tsx
import { memo as memo2, useMemo as useMemo2 } from "react";
import { Box as Box2, Text as Text2, Newline as Newline2 } from "ink";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var UnitPositionsDisplay = memo2(({ units, showUnitPositions }) => {
  if (!showUnitPositions || Object.keys(units).length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs2(Box2, { flexDirection: "column", marginTop: 1, children: [
    /* @__PURE__ */ jsx2(Text2, { bold: true, children: "Unit Positions:" }),
    Object.entries(units).map(([unitId, unit]) => {
      const positionData = unit.getPropertyValue("position");
      if (positionData) {
        const unitName = unit.name || unitId;
        return /* @__PURE__ */ jsxs2(Text2, { children: [
          unitName,
          " (",
          unitId.substring(0, 8),
          "...) at ",
          positionData.mapId,
          " (",
          positionData.position.x,
          ", ",
          positionData.position.y,
          ")"
        ] }, unitId);
      }
      return null;
    }).filter(Boolean)
  ] });
});
var GameRenderer = memo2(({
  world,
  units = {},
  config = {}
}) => {
  const mapsToRender = useMemo2(() => {
    const maps = world.getAllMaps();
    return config.selectedMap ? maps.filter((map) => map.name === config.selectedMap) : maps;
  }, [world, config.selectedMap]);
  return /* @__PURE__ */ jsxs2(Box2, { flexDirection: "column", padding: 1, children: [
    /* @__PURE__ */ jsx2(Box2, { flexDirection: "row", justifyContent: "space-between", marginBottom: 1, children: /* @__PURE__ */ jsx2(Text2, { bold: true, color: "cyan", children: "Takao Engine - Game View" }) }),
    mapsToRender.length === 0 ? /* @__PURE__ */ jsx2(Text2, { color: "yellow", children: "No maps available" }) : mapsToRender.map((map, index) => /* @__PURE__ */ jsxs2(Box2, { flexDirection: "column", marginBottom: 2, children: [
      /* @__PURE__ */ jsx2(
        MapRenderer,
        {
          map,
          units,
          showCoordinates: true,
          cellWidth: 1,
          showUnits: true,
          showTerrain: true,
          compactView: true,
          useColors: true
        }
      ),
      index < mapsToRender.length - 1 && /* @__PURE__ */ jsx2(Newline2, {})
    ] }, map.name)),
    /* @__PURE__ */ jsx2(UnitPositionsDisplay, { units, showUnitPositions: config.showUnitPositions })
  ] });
});

// src/index.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
var renderMap = (map, units, options) => {
  const { waitUntilExit } = render(
    /* @__PURE__ */ jsx3(
      MapRenderer,
      {
        map,
        units,
        ...options
      }
    )
  );
  return waitUntilExit;
};
var renderGame = (world, units, config = {}) => {
  const { waitUntilExit } = render(
    /* @__PURE__ */ jsx3(
      GameRenderer,
      {
        world,
        units,
        config
      }
    )
  );
  return waitUntilExit;
};
export {
  GameRenderer,
  MapRenderer,
  renderGame,
  renderMap
};
//# sourceMappingURL=index.js.map