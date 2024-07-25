import { fileSystem, FileSystemItem } from '../fileSystem/fileSystem';
import { addCommandToHistory, getCommandHistory, navigateHistory } from './historyManager';
import { marked } from 'marked';

type Command = 'compgen' | 'help' | 'clear' | 'ls' | 'cd' | 'cat' | 'man' | 'history' | 'date' | 'github' | 'setbg';

const compgenHelpText = `<span style="color: #FFFF00;">cat</span>
<span style="color: #FFFF00;">cd</span>
<span style="color: #FFFF00;">clear</span>
<span style="color: #FFFF00;">compgen</span>
<span style="color: #FFFF00;">date</span>
<span style="color: #FFFF00;">github</span>
<span style="color: #FFFF00;">history</span>
<span style="color: #FFFF00;">help</span>
<span style="color: #FFFF00;">ls</span>
<span style="color: #FFFF00;">man</span>
<span style="color: #FFFF00;">setbg</span>`;

const commands: Record<Command, string | null> = {
  compgen: compgenHelpText,
  help: 'Type a command and press Enter. Use "compgen" to list all commands, and "man" to show the manual pages for each command.',
  clear: null,
  ls: null,
  cd: null,
  cat: null,
  man: null,
  history: null,
  date: null,
  github: null,
  setbg: null,
};

const manPages: Record<string, string> = {
  compgen: 'Lists all available commands.',
  help: 'Displays a help message.',
  clear: 'Clears the terminal screen.',
  ls: 'Lists the contents of the current directory.',
  cd: 'Changes the current directory. Usage: cd &lt;directory&gt;',
  cat: 'Displays the contents of a file. Usage: cat &lt;file&gt;',
  man: 'Displays the manual page for a command. Usage: man &lt;command&gt;',
  history: 'Displays the list of history of commands used.',
  date: 'Displays the current date and time.',
  github: 'Opens the GitHub page in a new tab.',
  setbg: 'Changes the background color of the terminal. Usage: setBg &lt;color&gt;',
};

const isCommand = (command: string): command is Command => {
  return command in commands;
};

let currentDirectory: FileSystemItem[] = fileSystem;
const directoryStack: FileSystemItem[][] = [];
let currentPath: string = '/';

// Cache for file contents
const fileContentCache: Record<string, string> = {};

const findItem = (name: string, directory: FileSystemItem[]): FileSystemItem | undefined => {
  return directory.find(item => item.name === name);
};

const fetchFileContent = async (path: string): Promise<string> => {
  if (fileContentCache[path]) {
    return fileContentCache[path];
  }

  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to fetch file content from ${path}`);
  }

  const content = await response.text();
  fileContentCache[path] = content;
  return content;
};

const prefetchFiles = async () => {
  const filesToPrefetch = fileSystem
    .flatMap(item => item.type === 'directory' ? item.children || [] : [item])
    .filter(item => item.type === 'file' && item.path?.endsWith('.txt'));

  for (const file of filesToPrefetch) {
    if (file.path) {
      await fetchFileContent(file.path);
    }
  }
};

export const getResponseForCommand = async (command: string): Promise<string | null> => {
  const [cmd, ...args] = command.split(' ');

  addCommandToHistory(command);

  if (isCommand(cmd)) {
    switch (cmd) {
      case 'ls': {
        return currentDirectory
          .map(item => {
            if (item.type === 'directory') {
              return `<span style="color: #729fcf;">${item.name}</span>`;
            }
            return item.name;
          })
          .join(' ');
      }
      case 'cd': {
        if (args.length !== 1) return "Usage: cd &lt;directory&gt;";

        if (args[0] === '..') {
          if (directoryStack.length === 0) {
            return 'Already at root';
          }
          currentDirectory = directoryStack.pop()!;
          currentPath = currentPath.substring(0, currentPath.lastIndexOf('/')) || '/';
          return currentPath;
        }

        const dir = findItem(args[0], currentDirectory);
        if (dir && dir.type === 'directory') {
          directoryStack.push(currentDirectory);
          currentDirectory = dir.children || [];
          currentPath = `${currentPath}${args[0]}`;
          return currentPath;
        }
        return `Directory not found: ${args[0]}`;
      }
      case 'cat': {
        if (args.length !== 1) return "Usage: cat &lt;file&gt;";
        const file = findItem(args[0], currentDirectory);
        if (file && file.type === 'file' && file.path) {
          try {
            const content = await fetchFileContent(file.path);
            if (file.path.endsWith('.md')) {
              return marked.parse(content);
            }
            return content;
          } catch (error) {
            if (error instanceof Error) {
              return `Error reading file: ${error.message}`;
            } else {
              return `Unknown error occurred`;
            }
          }
        }
        return `File not found: ${args[0]}`;
      }
      case 'man': {
        if (args.length !== 1) return "Usage: man &lt;command&gt;";
        return manPages[args[0]] || `No manual entry for ${args[0]}`;
      }
      case 'history':
        return getCommandHistory();
      case 'date': {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short'
        };
        return now.toLocaleDateString('en-US', options) + ' ' + now.toLocaleTimeString('en-US', { hour12: false });
      }
      case 'github': {
        window.open('https://github.com/sridamul', '_blank');
        return 'Redirecting to GitHub page... If not redirected, click <a href="https://github.com/sridamul" target="_blank">here</a>.';
      }
      case 'setbg': {
        if (args.length !== 1) return "Usage: setBg &lt;color&gt;";

        const color = args[0];
        document.documentElement.style.setProperty('--terminal-bg-color', color);
        return `Background color changed to ${color}`;
      }
      case 'compgen':
      case 'help':
      case 'clear': {
        return commands[cmd];
      }
      default: {
        return 'Command not found. Type "compgen" for a list of commands.';
      }
    }
  }

  return 'Command not found. Type "compgen" for a list of commands.';
};

prefetchFiles();

export const handleArrowKey = (key: 'up' | 'down', currentInput: string): string => {
  return navigateHistory(key, currentInput);
};
