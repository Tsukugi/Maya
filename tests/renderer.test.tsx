import React from 'react';
import { render } from 'ink-testing-library';
import { MapRenderer, GameRenderer, ActionDiary } from '../src';
import { Map as GameMap, World, Position } from '@atsu/choukai';
import { BaseUnit } from '@atsu/atago';
import { expect, test } from 'vitest';
import type { DiaryEntry } from '../src/types';

const stripAnsi = (str: string) => str.replace(/\u001b\[[0-9;]*m/g, '');

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

test('MapRenderer rerenders when unit position changes without new units object', () => {
  const testMap = new GameMap(4, 4, 'Demo Map');
  const unit = new BaseUnit('STATIC_UNIT', 'Zenith', 'test');
  const units = { STATIC_UNIT: unit };

  const { unmount, lastFrame, rerender } = render(
    <MapRenderer map={testMap} units={units} showCoordinates={false} showTerrain={false} />
  );

  expect(lastFrame()).not.toContain('Z');

  unit.setProperty('position', { mapId: 'Demo Map', position: new Position(1, 1) });
  rerender(
    <MapRenderer map={testMap} units={units} showCoordinates={false} showTerrain={false} />
  );

  expect(lastFrame()).toContain('Z');
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
  unit.setProperty('position', {
    unitId: 'TEST_UNIT',
    mapId: 'Test World Map',
    position: new Position(2, 2),
  });
  const units = { 'TEST_UNIT': unit };

  const { unmount, lastFrame } = render(
    <GameRenderer world={world} units={units} config={{}} />
  );

  expect(lastFrame()).toContain('T'); // Unit initial on map
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

  const output = stripAnsi(lastFrame() ?? '');

  expect(output).toContain('Action Diary');
  expect(output).toContain('Hero moves to position (2, 2)');
  expect(output).toContain('Goblin attacks Hero');
  expect(output).toMatch(/1\s*\|/); // Turn number shown without label
  expect(output).toMatch(/2\s*\|/);
  unmount();
});

test('ActionDiary should wrap long descriptions across lines', () => {
  const longEntry: DiaryEntry = {
    turn: 3,
    timestamp: new Date().toISOString(),
    action: {
      player: 'Trader',
      type: 'dialogue',
      description: 'Quill the adventurer negotiates with another unit to secure resources and arrange a lasting truce between rival factions.',
    }
  };

  const { unmount, lastFrame } = render(
    <ActionDiary diaryEntries={[longEntry]} maxEntries={5} />
  );

  const output = stripAnsi(lastFrame() ?? '');

  expect(output).toContain('Quill the adventurer negotiates');
  expect(output).toContain('secure resources');
  expect(output).toContain('lasting truce'); // ensure tail of description appears (wrapped, not truncated)
  unmount();
});

test('ActionDiary component should handle empty entries', () => {
  const { unmount, lastFrame } = render(
    <ActionDiary diaryEntries={[]} />
  );

  const output = stripAnsi(lastFrame() ?? '');

  expect(output).toContain('No actions executed yet...');
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

  const output = stripAnsi(lastFrame() ?? '');

  expect(output).toContain('T'); // Unit on map
  expect(output).toContain('Action Diary'); // Diary title
  expect(output).toMatch(/1\s*\|/); // Diary turn displayed
  expect(output).toContain('Hero moves'); // Diary entry beginning
  expect(output).toContain('(2,'); // Wrapped content still visible
  expect(output).toContain('2)'); // Wrapped content still visible
  unmount();
});
