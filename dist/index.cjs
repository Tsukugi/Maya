"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var index_exports = {};
__export(index_exports, {
  GameRenderer: () => GameRenderer,
  MapRenderer: () => MapRenderer,
  renderGame: () => renderGame,
  renderMap: () => renderMap
});
module.exports = __toCommonJS(index_exports);
var import_ink3 = require("ink");

// src/components/MapRenderer.tsx
var import_react = require("react");
var import_ink = require("ink");
var import_jsx_runtime = require("react/jsx-runtime");
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
var MapRenderer = (0, import_react.memo)(({
  map,
  units = {},
  showCoordinates = true,
  cellWidth = 1,
  showUnits = true,
  showTerrain = true,
  compactView = true,
  useColors = true
}) => {
  const mapDisplay = (0, import_react.useMemo)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_ink.Box, { flexDirection: "column", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ink.Text, { bold: true, children: `Map: ${map.name} (${map.width}x${map.height})` }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ink.Newline, {}),
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
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ink.Box, { flexDirection: "row", children: segments.map((segment, segIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ink.Text, { color: segment.color, children: segment.content }, segIndex)) }, rowIndex);
    })
  ] });
});

// src/components/GameRenderer.tsx
var import_react2 = require("react");
var import_ink2 = require("ink");
var import_jsx_runtime2 = require("react/jsx-runtime");
var UnitPositionsDisplay = (0, import_react2.memo)(({ units, showUnitPositions }) => {
  if (!showUnitPositions || Object.keys(units).length === 0) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_ink2.Box, { flexDirection: "column", marginTop: 1, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ink2.Text, { bold: true, children: "Unit Positions:" }),
    Object.entries(units).map(([unitId, unit]) => {
      const positionData = unit.getPropertyValue("position");
      if (positionData) {
        const unitName = unit.name || unitId;
        return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_ink2.Text, { children: [
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
var GameRenderer = (0, import_react2.memo)(({
  world,
  units = {},
  config = {}
}) => {
  const mapsToRender = (0, import_react2.useMemo)(() => {
    const maps = world.getAllMaps();
    return config.selectedMap ? maps.filter((map) => map.name === config.selectedMap) : maps;
  }, [world, config.selectedMap]);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_ink2.Box, { flexDirection: "column", padding: 1, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ink2.Box, { flexDirection: "row", justifyContent: "space-between", marginBottom: 1, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ink2.Text, { bold: true, color: "cyan", children: "Takao Engine - Game View" }) }),
    mapsToRender.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ink2.Text, { color: "yellow", children: "No maps available" }) : mapsToRender.map((map, index) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_ink2.Box, { flexDirection: "column", marginBottom: 2, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
      index < mapsToRender.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ink2.Newline, {})
    ] }, map.name)),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(UnitPositionsDisplay, { units, showUnitPositions: config.showUnitPositions })
  ] });
});

// src/index.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var renderMap = (map, units, options) => {
  const { waitUntilExit } = (0, import_ink3.render)(
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
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
  const { waitUntilExit } = (0, import_ink3.render)(
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GameRenderer,
  MapRenderer,
  renderGame,
  renderMap
});
//# sourceMappingURL=index.cjs.map