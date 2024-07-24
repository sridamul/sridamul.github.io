const history: string[] = [];
let historyIndex = -1;
let tempInput = '';

export const addCommandToHistory = (command: string) => {
  if (history[history.length - 1] !== command) {
    history.push(command);
  }
  historyIndex = history.length;
};

export const navigateHistory = (direction: 'up' | 'down', currentInput: string): string => {
  if (direction === 'up') {
    if (historyIndex === history.length) {
      tempInput = currentInput; // Store the current input before navigating
    }
    historyIndex = Math.max(0, historyIndex - 1);
  } else if (direction === 'down') {
    historyIndex = Math.min(history.length, historyIndex + 1);
  }

  if (historyIndex === history.length) {
    return tempInput; // Return to the original input
  }

  return history[historyIndex] || '';
};

export const getCommandHistory = (): string => {
  return history.map((cmd, index) => `${index + 1}: ${cmd}`).join('\n');
};
