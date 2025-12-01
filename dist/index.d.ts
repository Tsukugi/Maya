import { Map, World } from '@atsu/choukai';
import { BaseUnit } from '@atsu/atago';
import React from 'react';

interface MapRendererProps {
    map: Map;
    units?: Record<string, BaseUnit>;
    showCoordinates?: boolean;
    cellWidth?: number;
    showUnits?: boolean;
    showTerrain?: boolean;
    compactView?: boolean;
    useColors?: boolean;
}
declare const MapRenderer: React.FC<MapRendererProps>;

interface IGameRendererConfig {
    showUnitPositions?: boolean;
    selectedMap?: string | undefined;
}
interface GameRendererProps {
    world: World;
    units?: Record<string, BaseUnit>;
    config: IGameRendererConfig;
}
declare const GameRenderer: React.FC<GameRendererProps>;

declare const renderMap: (map: Map, units?: Record<string, BaseUnit>, options?: {
    showCoordinates?: boolean;
    cellWidth?: number;
    showUnits?: boolean;
    showTerrain?: boolean;
    compactView?: boolean;
    useColors?: boolean;
}) => () => Promise<void>;
declare const renderGame: (world: World, units?: Record<string, BaseUnit>, config?: IGameRendererConfig) => () => Promise<void>;

export { GameRenderer, MapRenderer, renderGame, renderMap };
