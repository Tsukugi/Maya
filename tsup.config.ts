import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['cjs', 'esm'],
  sourcemap: true,
  clean: true,
  dts: true,
  splitting: false,
});