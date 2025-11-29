// src/index.tsx
import { render } from "ink";

// src/components/MapRenderer.tsx
import { useEffect, useState } from "react";
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
var MapRenderer = ({
  map,
  unitNames = {},
  showCoordinates = true,
  cellWidth = 1,
  showUnits = true,
  showTerrain = true,
  compactView = true,
  useColors = true
}) => {
  const [mapState, setMapState] = useState([]);
  useEffect(() => {
    const updatedMap = [];
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
          const unitId = map.getUnitAt(x, y);
          if (unitId) {
            const unitName = unitNames[unitId] || unitId;
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
      updatedMap.push(row);
    }
    setMapState(updatedMap);
  }, [map, unitNames, showCoordinates, cellWidth, showUnits, showTerrain, compactView]);
  return /* @__PURE__ */ jsxs(Box, { flexDirection: "column", children: [
    /* @__PURE__ */ jsx(Text, { bold: true, children: `Map: ${map.name} (${map.width}x${map.height})` }),
    /* @__PURE__ */ jsx(Newline, {}),
    mapState.map((row, rowIndex) => /* @__PURE__ */ jsx(Box, { flexDirection: "row", children: row.map((cellData, cellIndex) => {
      const color = useColors ? cellData.isUnit ? UNIT_COLOR : TERRAIN_COLORS[cellData.terrain] : void 0;
      return /* @__PURE__ */ jsx(Text, { color, children: cellData.content }, cellIndex);
    }) }, rowIndex))
  ] });
};

// src/components/GameRenderer.tsx
import { Box as Box2, Text as Text2, Newline as Newline2 } from "ink";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var GameRenderer = ({
  world,
  unitNames = {},
  unitPositions = {},
  selectedMap
}) => {
  const maps = world.getAllMaps();
  const mapsToRender = selectedMap ? maps.filter((map) => map.name === selectedMap) : maps;
  const createUnitMap = (map) => {
    const mapUnits = {};
    Object.entries(unitNames).forEach(([unitId, name]) => {
      const pos = unitPositions[unitId];
      if (pos && pos.mapId === map.name) {
        mapUnits[unitId] = name;
      }
    });
    return mapUnits;
  };
  return /* @__PURE__ */ jsxs2(Box2, { flexDirection: "column", padding: 1, children: [
    /* @__PURE__ */ jsxs2(Box2, { flexDirection: "row", justifyContent: "space-between", marginBottom: 1, children: [
      /* @__PURE__ */ jsx2(Text2, { bold: true, color: "cyan", children: "Takao Engine - Game View" }),
      /* @__PURE__ */ jsx2(Text2, { color: "gray", children: (/* @__PURE__ */ new Date()).toLocaleTimeString() })
    ] }),
    mapsToRender.length === 0 ? /* @__PURE__ */ jsx2(Text2, { color: "yellow", children: "No maps available" }) : mapsToRender.map((map, index) => /* @__PURE__ */ jsxs2(Box2, { flexDirection: "column", marginBottom: 2, children: [
      /* @__PURE__ */ jsx2(
        MapRenderer,
        {
          map,
          unitNames: createUnitMap(map),
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
    Object.keys(unitPositions).length > 0 && /* @__PURE__ */ jsxs2(Box2, { flexDirection: "column", marginTop: 1, children: [
      /* @__PURE__ */ jsx2(Text2, { bold: true, children: "Unit Positions:" }),
      Object.entries(unitPositions).map(([unitId, posInfo]) => {
        const unitName = unitNames[unitId] || unitId;
        return /* @__PURE__ */ jsxs2(Text2, { children: [
          unitName,
          " (",
          unitId.substring(0, 8),
          "...) at ",
          posInfo.mapId,
          " (",
          posInfo.position.x,
          ", ",
          posInfo.position.y,
          ")"
        ] }, unitId);
      })
    ] })
  ] });
};

// src/index.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
var renderMap = (map, unitNames, options) => {
  const { waitUntilExit } = render(
    /* @__PURE__ */ jsx3(
      MapRenderer,
      {
        map,
        unitNames,
        ...options
      }
    )
  );
  return waitUntilExit;
};
var renderGame = (world, unitNames, unitPositions, selectedMap) => {
  const { waitUntilExit } = render(
    /* @__PURE__ */ jsx3(
      GameRenderer,
      {
        world,
        unitNames,
        unitPositions,
        selectedMap
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