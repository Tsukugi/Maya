import React, { memo } from "react";
import { Box, Text, Newline, useStdout } from "ink";
import type { ConsoleEntry } from "../types";

type PreparedEntry = {
  entry: ConsoleEntry;
  timeLabel: string;
  levelLabel: string;
  timeColumnWidth: number;
  levelColumnWidth: number;
  messageLines: string[];
  linesNeeded: number;
  levelColor?: "red" | "yellow" | "gray";
  dimText: boolean;
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
  entries: ConsoleEntry[],
  innerWidth: number
): PreparedEntry[] => {
  const timeColumnWidth = 8;
  const levelColumnWidth = 5;
  const availableMessageWidth = Math.max(
    innerWidth - timeColumnWidth - levelColumnWidth - 6,
    12
  );

  return entries.map((entry) => {
    const levelLabel = entry.level.toUpperCase();
    const message = [entry.prefix, entry.message].filter(Boolean).join(" ");
    const messageLines = wrapText(message, availableMessageWidth);

    const levelColor =
      entry.level === "error"
        ? "red"
        : entry.level === "warn"
          ? "yellow"
          : entry.level === "debug" || entry.level === "trace"
            ? "gray"
            : undefined;

    const dimText = entry.level === "debug" || entry.level === "trace";

    return {
      entry,
      timeLabel: formatTime(entry.timestamp),
      levelLabel,
      timeColumnWidth,
      levelColumnWidth,
      messageLines,
      linesNeeded: messageLines.length,
      levelColor,
      dimText,
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

export const LogConsole: React.FC<{
  entries: ConsoleEntry[];
  maxEntries?: number;
  maxHeight?: number;
  title?: string;
  availableWidth?: number;
}> = memo(
  ({
    entries = [],
    maxEntries = 200,
    maxHeight = 12,
    title = "Console Log",
    availableWidth,
  }) => {
    const { stdout } = useStdout();
    const displayedEntries = entries.slice(-maxEntries);

    const height = Math.min(maxHeight, 30);
    const terminalWidth = stdout.columns || 80;
    const outerWidth =
      typeof availableWidth === "number" && availableWidth > 0
        ? availableWidth
        : terminalWidth;
    const innerWidth = Math.max(outerWidth - 6, 20);

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
            <Text color="gray">No log entries yet...</Text>
          </Box>
        ) : (
          <Box flexDirection="column" flex={1}>
            {fittingEntries.map((item, index) => (
              <Box
                key={`${item.entry.timestamp}-${index}`}
                flexDirection="column"
                width="100%"
                marginBottom={item.addBottomSpacing ? 1 : 0}
              >
                {item.messageLines.map((line, lineIndex) => (
                  <Box
                    key={`${item.entry.timestamp}-${index}-${lineIndex}`}
                    flexDirection="row"
                    width="100%"
                    alignItems="flex-start"
                  >
                    <Box
                      width={item.timeColumnWidth}
                      marginRight={1}
                      flexShrink={0}
                    >
                      {lineIndex === 0 ? (
                        <Text color="gray" dimColor>
                          {item.timeLabel}
                        </Text>
                      ) : (
                        <Text>{""}</Text>
                      )}
                    </Box>
                    <Text color="gray">|</Text>
                    <Box
                      width={item.levelColumnWidth}
                      marginLeft={1}
                      marginRight={1}
                      flexShrink={0}
                    >
                      {lineIndex === 0 ? (
                        <Text color={item.levelColor} dimColor={item.dimText}>
                          {item.levelLabel}
                        </Text>
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
                      minWidth={0}
                    >
                      <Text color={item.levelColor} dimColor={item.dimText}>
                        {line}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  }
);
