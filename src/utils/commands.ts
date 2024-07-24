import { fileSystem, FileSystemItem } from '../fileSystem/fileSystem';

type Command = 'compgen' | 'help' | 'greet' | 'clear' | 'ls' | 'cd' | 'cat' | 'man';

const commands: Record<Command, string | null> = {
  compgen: 'Available commands: cat, cd, clear, compgen, greet, help, ls, man',
  help: 'Type a command and press Enter. Use "compgen" to list all commands.',
  greet: 'Hello! How can I assist you today?',
  clear: null,
  ls: null,
  cd: null,
  cat: null,
  man: null,
};

const manPages: Record<string, string> = {
  compgen: 'Lists all available commands.',
  help: 'Displays a help message.',
  greet: 'Displays a greeting message.',
  clear: 'Clears the terminal screen.',
  ls: 'Lists the contents of the current directory.',
  cd: 'Changes the current directory. Usage: cd &lt;directory&gt;',
  cat: 'Displays the contents of a file. Usage: cat &lt;file&gt;',
  man: 'Displays the manual page for a command. Usage: man &lt;command&gt;',
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
      case 'compgen':
      case 'help':
      case 'greet':
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
