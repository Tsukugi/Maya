import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    globals: true,
    environment: 'node',
    typecheck: {
      enabled: false
    }
  }
});