import React, { memo } from 'react';
import { Box, Text, Newline } from 'ink';
import type { IActionDiaryProps, DiaryEntry } from '../types';

export const ActionDiary: React.FC<IActionDiaryProps> = memo(({
  diaryEntries = [],
  maxEntries = 20,
  maxHeight = 20, // Default to 20, max 50
  title = 'Action Diary'
}) => {
  // Limit the number of displayed actions
  const displayedEntries = diaryEntries.slice(-maxEntries);

  // Limit height to maximum of 50 rows
  const height = Math.min(maxHeight, 50);

  return (
    <Box flexDirection="column" borderStyle="round" padding={1} width={50} height={height}>
      <Text bold color="yellow">{title}</Text>
      <Newline />
      {displayedEntries.length === 0 ? (
        <Box flex={1} justifyContent="center" alignItems="center">
          <Text color="gray">No actions executed yet...</Text>
        </Box>
      ) : (
        <Box flexDirection="column" flex={1} overflow="hidden">
          {displayedEntries.map((entry, index) => (
            <Box key={`${entry.turn}-${index}`} flexDirection="column" marginBottom={1}>
              <Text>
                <Text color="green">✓</Text>
                {' '}
                <Text color="cyan">{`[Turn ${entry.turn}]`}</Text>
                {' '}
                <Text>{entry.action.description}</Text>
              </Text>
              <Text color="gray" dimColor>{new Date(entry.timestamp).toLocaleTimeString()}</Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
});