# Maya - Modern Rendering System for TakaoEngine

Maya is a modern, efficient rendering system for the TakaoEngine, built using Ink and React to provide a superior terminal user interface experience.

## Features

- **Component-based Rendering**: Built with React components for easy composition
- **Efficient Updates**: Uses Ink's optimized rendering to only update changed content
- **Fixed Display Area**: Prevents scrolling issues with a fixed display area
- **Color Support**: Full color terminal support for different terrain types and units
- **Responsive Layout**: Flexbox-based layout that adapts to terminal size

## Installation

```bash
npm install @atsu/maya
```

## Usage

### Rendering a Single Map

```tsx
import { MapRenderer } from '@atsu/maya';
import { render } from 'ink';

const { waitUntilExit } = render(<MapRenderer map={myMap} />);
await waitUntilExit();
```

### Rendering a Game World

```tsx
import { GameRenderer } from '@atsu/maya';
import { render } from 'ink';

const { waitUntilExit } = render(
  <GameRenderer 
    world={myWorld} 
    unitNames={unitNames}
    unitPositions={unitPositions}
  />
);
await waitUntilExit();
```

## Components

### `MapRenderer`
Renders a single game map with customizable options for terrain, units, and display preferences.

### `GameRenderer`
Renders an entire game world with multiple maps and unit position information.

## Advantages Over Old System

1. **Fixed Display**: No more scrolling down - the display stays in place
2. **Efficient Updates**: Only changed elements are rerendered
3. **Better Performance**: Ink's optimized rendering system
4. **Modern UI**: React-based component architecture
5. **Responsive**: Adapts to terminal dimensions

## Integration with TakaoEngine

The Maya renderer can be integrated with existing TakaoEngine applications:

```tsx
import { renderGame } from '@atsu/maya';
import { TakaoImpl } from '@atsu/takao';

const takao = new TakaoImpl();
await takao.initialize();

// Convert Takao world state for Maya
const world = takao.getWorld();
const unitNames = {/* unit name mappings */};
const unitPositions = {/* unit position mappings */};

// Render with Maya
renderGame(world, unitNames, unitPositions);
```

## Examples

Check out the `examples/` directory for usage examples:

- `demo.tsx`: A standalone demo showing Maya's capabilities
- `integration.tsx`: Example of integrating Maya with TakaoEngine