import { describe, expect, test } from 'vitest';
import { resolveDiaryLayout } from '../src/components/GameRenderer';
import type { IGameRendererConfig } from '../src/types';

describe('resolveDiaryLayout', () => {
  test('falls back to column layout width and defaults', () => {
    const config: IGameRendererConfig = {};
    const result = resolveDiaryLayout(config, 90, true);

    expect(result.height).toBe(30); // default diary height
    expect(result.minWidth).toBe('100%');
    expect(result.maxWidth).toBe('100%');
    expect(result.flexBasis).toBe('0');
    expect(result.approxWidth).toBe(90); // column layout uses full terminal width
  });

  test('applies min width when percent is smaller and caps by numeric max', () => {
    const config: IGameRendererConfig = {
      diaryWidthPercentage: 40,
      minDiaryWidth: 50,
      maxDiaryWidth: 60,
      diaryMaxHeight: 25,
    };

    const result = resolveDiaryLayout(config, 100, false);

    // widthByPercent = floor((100 - 4) * 0.4) = 38, then minApplied = 50, max cap = 60
    expect(result.approxWidth).toBe(50);
    expect(result.height).toBe(25);
    expect(result.minWidth).toBe(50);
    expect(result.maxWidth).toBe(60);
  });

  test('caps width when max is given as percent string', () => {
    const config: IGameRendererConfig = {
      diaryWidthPercentage: 80,
      minDiaryWidth: 30,
      maxDiaryWidth: '50%',
    };

    const result = resolveDiaryLayout(config, 100, false);

    // widthByPercent = floor((100 - 4) * 0.8) = 76, minApplied = 76, maxPct = floor(96 * 0.5) = 48
    expect(result.approxWidth).toBe(48);
    expect(result.maxWidth).toBe('50%');
    expect(result.minWidth).toBe(30);
  });
});
