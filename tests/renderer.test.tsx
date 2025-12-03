import React from 'react';
import { render } from 'ink-testing-library';
import { MapRenderer, GameRenderer, ActionDiary } from '../src';
import { Map as GameMap, World, Position } from '@atsu/choukai';
import { BaseUnit } from '@atsu/atago';
import { expect, test } from 'vitest';
import type { DiaryEntry } from '../src/types';

test('MapRenderer should render a map with terrain', () => {
  const testMap = new GameMap(5, 5, 'Test Map');
  testMap.setTerrain(2, 2, 'water');

  const { unmount, lastFrame } = render(
    <MapRenderer map={testMap} />
  );

  expect(lastFrame()).toContain('Test Map');
  expect(lastFrame()).toContain('~'); // Water symbol
  unmount();
});

test('MapRenderer should render units on the map', () => {
  const testMap = new GameMap(5, 5, 'Test Map');

  const unit = new BaseUnit('TEST_UNIT', 'TestUnit', 'test');
  unit.setProperty('position', { mapId: 'Test Map', position: new Position(2, 2) });
  const units = { 'TEST_UNIT': unit };

  const { unmount, lastFrame } = render(
    <MapRenderer map={testMap} units={units} />
  );

  expect(lastFrame()).toContain('T'); // Unit initial
  unmount();
});

test('GameRenderer should render a game world with maps', () => {
  const world = new World();
  const testMap = new GameMap(5, 5, 'Test World Map');
  world.addMap(testMap);

  const { unmount, lastFrame } = render(
    <GameRenderer world={world} config={{}} />
  );

  expect(lastFrame()).toContain('Test World Map');
  unmount();
});

test('GameRenderer should render units in the game world', () => {
  const world = new World();
  const testMap = new GameMap(5, 5, 'Test World Map');
  world.addMap(testMap);

  const unit = new BaseUnit('TEST_UNIT', 'TestUnit', 'test');
  unit.setProperty('position', { mapId: 'Test World Map', position: new Position(2, 2) });
  const units = { 'TEST_UNIT': unit };

  const { unmount, lastFrame } = render(
    <GameRenderer world={world} units={units} config={{ showUnitPositions: true }} />
  );

  expect(lastFrame()).toContain('T'); // Unit initial on map
  expect(lastFrame()).toContain('TestUnit'); // Unit in positions display
  unmount();
});

test('ActionDiary component should render diary entries', () => {
  const diaryEntries: DiaryEntry[] = [
    {
      turn: 1,
      timestamp: new Date().toISOString(),
      action: {
        player: 'Hero',
        type: 'move',
        description: 'Hero moves to position (2, 2)',
      }
    },
    {
      turn: 2,
      timestamp: new Date().toISOString(),
      action: {
        player: 'Goblin',
        type: 'attack',
        description: 'Goblin attacks Hero',
      }
    }
  ];

  const { unmount, lastFrame } = render(
    <ActionDiary diaryEntries={diaryEntries} />
  );

  expect(lastFrame()).toContain('Action Diary');
  expect(lastFrame()).toContain('Hero moves to position (2, 2)');
  expect(lastFrame()).toContain('Goblin attacks Hero');
  expect(lastFrame()).toContain('[Turn 1]');
  expect(lastFrame()).toContain('[Turn 2]');
  unmount();
});

test('ActionDiary component should handle empty entries', () => {
  const { unmount, lastFrame } = render(
    <ActionDiary diaryEntries={[]} />
  );

  expect(lastFrame()).toContain('No actions executed yet...');
  unmount();
});

test('GameRenderer should render with diary when diary entries are provided', () => {
  const world = new World();
  const testMap = new GameMap(5, 5, 'Test World Map');
  world.addMap(testMap);

  const unit = new BaseUnit('TEST_UNIT', 'TestUnit', 'test');
  unit.setProperty('position', { mapId: 'Test World Map', position: new Position(2, 2) });
  const units = { 'TEST_UNIT': unit };

  const diaryEntries: DiaryEntry[] = [
    {
      turn: 1,
      timestamp: new Date().toISOString(),
      action: {
        player: 'Hero',
        type: 'move',
        description: 'Hero moves to position (2, 2)',
      }
    }
  ];

  const { unmount, lastFrame } = render(
    <GameRenderer
      world={world}
      units={units}
      diaryEntries={diaryEntries}
      config={{ showDiary: true }}
    />
  );

  expect(lastFrame()).toContain('T'); // Unit on map
  expect(lastFrame()).toContain('Action Diary'); // Diary title
  expect(lastFrame()).toContain('Hero moves to position (2, 2)'); // Diary entry
  unmount();
});