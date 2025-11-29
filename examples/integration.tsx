/**
 * Example: Integrating Maya with TakaoEngine
 *
 * Shows how to replace the old MapRenderer with the new Ink-based renderer
 */

import { TakaoImpl } from '@atsu/takao';
import { renderGame } from '../src/index';
import type { World, Position } from '@atsu/choukai';

interface IUnitPosition {
  unitId: string;
  mapId: string;
  position: Position;
}

// Function to convert Takao world state to format compatible with Maya renderer
const convertWorldForRendering = (takao: TakaoImpl) => {
  // Get the world instance from Takao
  const world: World = takao.getWorld();

  // Get units and their names
  const unitController = takao.getUnitController();
  const allUnits = unitController.getUnits();

  const unitNames: Record<string, string> = {};
  allUnits.forEach(unit => {
    unitNames[unit.id] = unit.name;
  });

  // Get unit positions from the world
  const unitPositions: Record<string, IUnitPosition> = {};
  allUnits.forEach(unit => {
    try {
      const unitPos = world.getUnitPosition(unit.id);
      if (unitPos) {
        unitPositions[unit.id] = {
          unitId: unit.id,
          mapId: unitPos.mapId,
          position: unitPos.position
        };
      }
    } catch (error) {
      console.error(`Could not get position for unit ${unit.id}:`, error);
    }
  });

  return { world, unitNames, unitPositions };
};

// Example of how to integrate Maya with Takao
export const runTakaoWithMayaRenderer = async () => {
  console.log('Starting Takao Engine with Maya renderer...');

  // Create Takao instance
  const takao = new TakaoImpl();

  // Initialize the game
  await takao.initialize();

  // Get converted world data for Maya
  const { world, unitNames, unitPositions } = convertWorldForRendering(takao);

  console.log('Rendering game world with Maya:');

  // Render the game using Maya
  renderGame(world, unitNames, unitPositions);

  // Start the game
  takao.start();

  // For demo purposes, stop after a few seconds
  setTimeout(() => {
    takao.stop();
    process.exit(0);
  }, 10000); // Stop after 10 seconds
};

// If this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTakaoWithMayaRenderer().catch(console.error);
}