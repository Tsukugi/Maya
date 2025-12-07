import React, { memo } from "react";
import { Box, Text, Newline, useStdout } from "ink";
import type { IActionDiaryProps, DiaryEntry } from "../types";

type PreparedEntry = {
  entry: DiaryEntry;
  turnLabel: string;
  timeLabel: string;
  turnColumnWidth: number;
  timeColumnWidth: number;
  descriptionLines: string[];
  linesNeeded: number;
};

const wrapText = (text: string, width: number): string[] => {
  if (width <= 0) {
    return [text];
  }

  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if (current.length === 0) {
      current = word;
      continue;
    }

    if (current.length + 1 + word.length > width) {
      lines.push(current);
      current = word;
    } else {
      current += ` ${word}`;
    }
  }

  if (current.length > 0) {
    lines.push(current);
  }

  return lines;
};

const formatTime = (timestamp: string) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(timestamp));

const buildEntries = (
  entries: DiaryEntry[],
  innerWidth: number
): PreparedEntry[] => {
  return entries.map((entry) => {
    const turnLabel = String(entry.turn);
    const turnColumnWidth = Math.max(turnLabel.length, 3);
    const timeColumnWidth = 8;
    const availableDescWidth = Math.max(
      innerWidth - turnColumnWidth - timeColumnWidth - 6,
      12
    );

    const descriptionLines = wrapText(
      entry.action.description,
      availableDescWidth
    );

    return {
      entry,
      turnLabel,
      timeLabel: formatTime(entry.timestamp),
      turnColumnWidth,
      timeColumnWidth,
      descriptionLines,
      linesNeeded: descriptionLines.length,
    };
  });
};

const packEntriesToHeight = (
  entries: PreparedEntry[],
  contentRows: number
) => {
  type PackedEntry = PreparedEntry & { addBottomSpacing: boolean };
  let usedRows = 0;
  const packed: PackedEntry[] = [];

  for (let i = entries.length - 1; i >= 0; i--) {
    const needsSpacing = packed.length > 0 ? 1 : 0;
    const totalNeeded = entries[i].linesNeeded + needsSpacing;
    if (usedRows + totalNeeded > contentRows) {
      continue;
    }

    packed.push({
      ...entries[i],
      addBottomSpacing: packed.length > 0,
    });
    usedRows += totalNeeded;
  }

  if (packed.length === 0 && entries.length > 0) {
    packed.push({
      ...entries[entries.length - 1],
      addBottomSpacing: false,
    });
  }

  return packed.reverse();
};

export const ActionDiary: React.FC<IActionDiaryProps> = memo(
  ({
    diaryEntries = [],
    maxEntries = 20,
    maxHeight = 20, // Default to 20, max 50
    title = "Action Diary",
    availableWidth,
  }) => {
    const { stdout } = useStdout();
    // Limit the number of displayed actions
    const displayedEntries = diaryEntries.slice(-maxEntries);

    // Limit height to maximum of 50 rows
    const height = Math.min(maxHeight, 50);
    const terminalWidth = stdout.columns || 80;
    // Prefer provided width (from parent layout), fallback to terminal width
    const outerWidth =
      typeof availableWidth === "number" && availableWidth > 0
        ? availableWidth
        : terminalWidth;
    // Subtract padding/border to get an approximate inner width
    const innerWidth = Math.max(outerWidth - 6, 20);

    // Calculate how many content rows we have after accounting for title + newline + borders
    const contentRows = Math.max(height - 3, 1);

    const preparedEntries = buildEntries(displayedEntries, innerWidth);
    const fittingEntries = packEntriesToHeight(preparedEntries, contentRows);

    return (
      <Box
        flexDirection="column"
        borderStyle="round"
        padding={1}
        flex={1}
        height={height}
        minWidth={50}
      >
        <Text bold color="yellow">
          {title}
        </Text>
        <Newline />
        {fittingEntries.length === 0 ? (
          <Box flex={1} justifyContent="center" alignItems="center">
            <Text color="gray">No actions executed yet...</Text>
          </Box>
        ) : (
          <Box flexDirection="column" flex={1}>
            {fittingEntries.map((item, index) => {
              const {
                entry,
                descriptionLines,
                turnLabel,
                turnColumnWidth,
                timeColumnWidth,
                timeLabel,
              } = item;

              return (
                <Box
                  key={`${entry.turn}-${index}`}
                  flexDirection="column"
                  width="100%"
                  marginBottom={item.addBottomSpacing ? 1 : 0}
                >
                  {descriptionLines.map((line, lineIndex) => (
                    <Box
                      key={`${entry.turn}-${index}-${lineIndex}`}
                      flexDirection="row"
                      width="100%"
                      alignItems="flex-start"
                    >
                      <Box
                        width={turnColumnWidth}
                        marginRight={1}
                        flexShrink={0}
                      >
                        {lineIndex === 0 ? (
                          <Text color="cyan">{turnLabel}</Text>
                        ) : (
                          <Text>{""}</Text>
                        )}
                      </Box>
                      <Text color="gray">|</Text>
                      <Box
                        flexGrow={1}
                        flexShrink={1}
                        flexBasis={0}
                        marginLeft={1}
                        marginRight={0}
                        minWidth={0}
                      >
                        <Text>{line}</Text>
                      </Box>
                      <Text color="gray">|</Text>
                      <Box
                        minWidth={timeColumnWidth}
                        marginLeft={1}
                        flexShrink={0}
                      >
                        {lineIndex === 0 ? (
                          <Text color="gray" dimColor>
                            {timeLabel}
                          </Text>
                        ) : (
                          <Text>{""}</Text>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    );
  }
);
