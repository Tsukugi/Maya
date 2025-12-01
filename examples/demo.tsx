/**
 * Demo: Maya Rendering System
 *
 * Demonstrates the new Ink-based rendering system for TakaoEngine
 */

import React, { useEffect, useState } from 'react';
import { Box, Text, Newline } from 'ink';
import { render } from 'ink';
import { Map as GameMap, World, Position } from '@atsu/choukai';
import { GameRenderer } from '../src/index';
import { BaseUnit } from '@atsu/atago';

// Create a sample game world for demonstration
const createDemoWorld = (): World => {
  const world = new World();

  // Create a main map
  const mainMap = new GameMap(15, 10, 'Main Realm');

  // Add some terrain
  for (let x = 2; x <= 4; x++) {
    for (let y = 2; y <= 4; y++) {
      mainMap.setTerrain(x, y, 'water');
    }
  }

  mainMap.setTerrain(6, 6, 'mountain');
  mainMap.setTerrain(7, 6, 'mountain');
  mainMap.setTerrain(8, 8, 'forest');
  mainMap.setTerrain(9, 8, 'forest');
  mainMap.setTerrain(10, 8, 'forest');
  mainMap.setTerrain(2, 8, 'desert');
  mainMap.setTerrain(12, 2, 'road');

  world.addMap(mainMap);

  // Create a second map
  const secondMap = new GameMap(12, 8, 'Forest Path');

  // Add forest terrain
  for (let x = 0; x < 12; x++) {
    for (let y = 0; y < 8; y++) {
      secondMap.setTerrain(x, y, 'forest');
    }
  }

  // Add a path
  for (let x = 5; x < 7; x++) {
    for (let y = 0; y < 8; y++) {
      secondMap.setTerrain(x, y, 'road');
    }
  }

  world.addMap(secondMap);

  return world;
};

const DemoApp = () => {
  const [world, setWorld] = useState<World | null>(null);
  const [units, setUnits] = useState<Record<string, BaseUnit>>({});

  useEffect(() => {
    // Initialize the demo world
    const demoWorld = createDemoWorld();
    setWorld(demoWorld);

    // Create units with position properties
    const player = new BaseUnit('PLAYER1', 'Hero', 'player');
    player.setProperty('position', { mapId: 'Main Realm', position: new Position(1, 1) });

    const enemy = new BaseUnit('ENEMY1', 'Goblin', 'enemy');
    enemy.setProperty('position', { mapId: 'Main Realm', position: new Position(8, 2) });

    const npc = new BaseUnit('NPC1', 'Merchant', 'npc');
    npc.setProperty('position', { mapId: 'Main Realm', position: new Position(10, 5) });

    const guard = new BaseUnit('GUARD1', 'Guard', 'guard');
    guard.setProperty('position', { mapId: 'Forest Path', position: new Position(5, 3) });

    const trader = new BaseUnit('TRADER1', 'Trader', 'trader');
    trader.setProperty('position', { mapId: 'Forest Path', position: new Position(6, 4) });

    setUnits({
      'PLAYER1': player,
      'ENEMY1': enemy,
      'NPC1': npc,
      'GUARD1': guard,
      'TRADER1': trader,
    });
  }, []);

  if (!world) {
    return <Text>Loading demo...</Text>;
  }

  return (
    <Box flexDirection="column">
      <Box flexDirection="row" justifyContent="center" marginBottom={1}>
        <Text bold color="magenta">Maya Rendering System Demo</Text>
      </Box>
      <GameRenderer
        world={world}
        units={units}
        config={{ showUnitPositions: true }}
      />
      <Newline />
      <Box flexDirection="row" justifyContent="center">
        <Text color="gray">Press Ctrl+C to exit</Text>
      </Box>
    </Box>
  );
};

// Render the demo application
render(<DemoApp />);