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

interface IUnitPosition {
  unitId: string;
  mapId: string;
  position: Position;
}

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
  const [unitNames, setUnitNames] = useState<Record<string, string>>({});
  const [unitPositions, setUnitPositions] = useState<Record<string, IUnitPosition>>({});

  useEffect(() => {
    // Initialize the demo world
    const demoWorld = createDemoWorld();
    setWorld(demoWorld);

    // Set up unit names
    setUnitNames({
      'PLAYER1': 'Hero',
      'ENEMY1': 'Goblin',
      'NPC1': 'Merchant',
      'GUARD1': 'Guard',
      'TRADER1': 'Trader',
    });

    // Set up unit positions manually since units aren't stored in the maps directly
    const positions: Record<string, IUnitPosition> = {
      'PLAYER1': { unitId: 'PLAYER1', mapId: 'Main Realm', position: new Position(1, 1) },
      'ENEMY1': { unitId: 'ENEMY1', mapId: 'Main Realm', position: new Position(8, 2) },
      'NPC1': { unitId: 'NPC1', mapId: 'Main Realm', position: new Position(10, 5) },
      'GUARD1': { unitId: 'GUARD1', mapId: 'Forest Path', position: new Position(5, 3) },
      'TRADER1': { unitId: 'TRADER1', mapId: 'Forest Path', position: new Position(6, 4) },
    };

    setUnitPositions(positions);
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
        unitNames={unitNames}
        unitPositions={unitPositions}
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