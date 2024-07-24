import { fileSystem, FileSystemItem } from '../fileSystem/fileSystem';
import { addCommandToHistory, getCommandHistory, navigateHistory } from './historyManager';

type Command = 'compgen' | 'help' | 'clear' | 'ls' | 'cd' | 'cat' | 'man' | 'history' | 'date' | 'github';

const commands: Record<Command, string | null> = {
  compgen: 'Available commands: cat, cd, clear, compgen, date, help, ls, man, history',
  help: 'Type a command and press Enter. Use "compgen" to list all commands, and "man" to show the manual pages for each command.',
  clear: null,
  ls: null,
  cd: null,
  cat: null,
  man: null,
  history: null,
  date: null,
  github: null,
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
  github: 'Opens the GitHub page in a new tab.'

};

const isCommand = (command: string): command is Command => {
  return command in commands;
};

let currentDirectory: FileSystemItem[] = fileSystem;
const directoryStack: FileSystemItem[][] = [];
let currentPath: string = '/';

const findItem = (name: string, directory: FileSystemItem[]): FileSystemItem | undefined => {
  return directory.find(item => item.name === name);
};

export const getResponseForCommand = (command: string): string | null => {
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
        if (file && file.type === 'file') {
          if (file.extension === 'txt') {
            return file.content || '';
          } else if (file.extension === 'pdf') {
            return `Download the PDF file <a href="/path/to/${file.name}.pdf" download>${file.name}.pdf</a>`;
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

export const handleArrowKey = (key: 'up' | 'down', currentInput: string): string => {
  return navigateHistory(key, currentInput);
};
