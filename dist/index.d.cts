import { Map, Position, World } from '@atsu/choukai';
import React from 'react';

interface MapRendererProps {
    map: Map;
    unitNames?: Record<string, string>;
    unitPositions?: Record<string, {
        mapId: string;
        position: Position;
    }>;
    showCoordinates?: boolean;
    cellWidth?: number;
    showUnits?: boolean;
    showTerrain?: boolean;
    compactView?: boolean;
    useColors?: boolean;
}
declare const MapRenderer: React.FC<MapRendererProps>;

interface IUnitPosition$1 {
    unitId: string;
    mapId: string;
    position: Position;
}
interface GameRendererProps {
    world: World;
    unitNames?: Record<string, string>;
    unitPositions?: Record<string, IUnitPosition$1>;
    selectedMap?: string;
}
declare const GameRenderer: React.FC<GameRendererProps>;

interface IUnitPosition {
    unitId: string;
    mapId: string;
    position: Position;
}
declare const renderMap: (map: Map, unitNames?: Record<string, string>, options?: {
    showCoordinates?: boolean;
    cellWidth?: number;
    showUnits?: boolean;
    showTerrain?: boolean;
    compactView?: boolean;
    useColors?: boolean;
}) => () => Promise<void>;
declare const renderGame: (world: World, unitNames?: Record<string, string>, unitPositions?: Record<string, IUnitPosition>, selectedMap?: string) => () => Promise<void>;

export { GameRenderer, MapRenderer, renderGame, renderMap };
