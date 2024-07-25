import { FileSystemItem } from '../fileSystem/fileSystem';

export const getAutocompleteSuggestions = (
  input: string,
  currentDirectory: FileSystemItem[]
): string[] => {
  const commands = ['compgen', 'help', 'clear', 'ls', 'cd', 'cat', 'man', 'history', 'date', 'github', 'setbg'];
  const suggestions = commands.filter((command) => command.startsWith(input));

  const currentDirectoryItems = currentDirectory
    .map((item) => item.name)
    .filter((name) => name.startsWith(input));

  return [...suggestions, ...currentDirectoryItems];
};

export const getCdSuggestions = (
  input: string,
  currentDirectory: FileSystemItem[]
): string[] => {
  return currentDirectory
    .filter((item) => item.type === 'directory' && item.name.startsWith(input))
    .map((item) => item.name);
};

export const getCatSuggestions = (
  input: string,
  currentDirectory: FileSystemItem[]
): string[] => {
  return currentDirectory
    .filter((item) => item.type === 'file' && item.name.startsWith(input))
    .map((item) => item.name);
};
