const history: string[] = [];
let historyIndex = -1;

export const addCommandToHistory = (command: string) => {
  if (history[history.length - 1] !== command) {
    history.push(command);
  }
  historyIndex = history.length;
};

export const navigateHistory = (direction: 'up' | 'down'): string => {
  if (direction === 'up') {
    historyIndex = Math.max(0, historyIndex - 1);
  } else if (direction === 'down') {
    historyIndex = Math.min(history.length - 1, historyIndex + 1);
  }
  return history[historyIndex] || '';
};

export const getCommandHistory = (): string => {
  return history.map((cmd, index) => `${index + 1}: ${cmd}`).join('\n');
};
