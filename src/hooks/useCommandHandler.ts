import { useState, useEffect, useRef } from 'react';
import { getTerminalPrompt } from '../utils/getTerminalPrompt';
import { getResponseForCommand, handleArrowKey } from '../utils/commands';
import { getAutocompleteSuggestions, getCdSuggestions, getCatSuggestions } from '../utils/autocomplete';
import useAutoFocus from '../hooks/useAutoFocus';
import { FileSystemItem, fileSystem as rootFileSystem } from '../fileSystem/fileSystem';

const useCommandHandler = () => {
  const [inputValue, setInputValue] = useState('');
  const [output, setOutput] = useState<{ promptPart: string; commandPart: string; response: string }[]>([]);
  const [prompt, setPrompt] = useState<string>('Loading prompt...');
  const [currentDirectory, setCurrentDirectory] = useState<FileSystemItem[]>(rootFileSystem);
  const [currentPath, setCurrentPath] = useState<string>('/');
  const directoryStack = useRef<FileSystemItem[][]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchPrompt = async () => {
      const promptText = await getTerminalPrompt();
      setPrompt(promptText);
    };

    fetchPrompt();
  }, []);

  useAutoFocus(inputRef);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const command = inputValue.trim().toLowerCase();
    const response = await getResponseForCommand(command);

    const commandPart = inputValue.trim();
    const promptPart = `${prompt}${currentPath.trim()}#`;

    if (commandPart === '') {
      setOutput((prevOutput) => [
        ...prevOutput,
        { promptPart, commandPart, response: '' }
      ]);
      setInputValue('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }

    if (command === 'clear') {
      setOutput([]);
      setInputValue('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }

    if (command.startsWith('cd')) {
      const updatedPath = response && response.startsWith('/') ? response : currentPath;
      if (response && updatedPath !== currentPath) {
        setCurrentPath(updatedPath);
        setOutput((prevOutput) => [
          ...prevOutput,
          { promptPart, commandPart, response: '' }
        ]);

        if (command === 'cd ..') {
          const newDir = directoryStack.current.pop() || rootFileSystem;
          setCurrentDirectory(newDir);
          if (directoryStack.current.length === 0) {
            setCurrentPath('/');
          }
        } else {
          const newDir = findItem(command.split(' ')[1], currentDirectory);
          if (newDir && newDir.type === 'directory') {
            directoryStack.current.push(currentDirectory);
            setCurrentDirectory(newDir.children || []);
          }
        }
      } else {
        setOutput((prevOutput) => [
          ...prevOutput,
          { promptPart, commandPart, response: response || 'Error: Invalid path' }
        ]);
      }
      setInputValue('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }

    const updatedPath = response && response.startsWith('/') ? response : currentPath;
    if (response && updatedPath !== currentPath) {
      setCurrentPath(updatedPath);
    }

    setOutput((prevOutput) => [
      ...prevOutput,
      { promptPart, commandPart, response: response || 'Error: Command not found' }
    ]);
    setInputValue('');

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const previousCommand = handleArrowKey('up', inputValue);
      setInputValue(previousCommand);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextCommand = handleArrowKey('down', inputValue);
      setInputValue(nextCommand);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      let suggestions: string[] = [];
      const inputParts = inputValue.split(' ');

      if (inputParts[0] === 'cd' && inputParts.length === 2) {
        suggestions = getCdSuggestions(inputParts[1], currentDirectory);
      } else if (inputParts[0] === 'cat' && inputParts.length === 2) {
        suggestions = getCatSuggestions(inputParts[1], currentDirectory);
      } else {
        suggestions = getAutocompleteSuggestions(inputValue, currentDirectory);
      }

      if (suggestions.length === 1) {
        setInputValue(inputParts.length === 2 ? `${inputParts[0]} ${suggestions[0]}` : suggestions[0]);
      } else if (suggestions.length > 1) {
        const promptPart = `${prompt}${currentPath.trim()}#`;
        const commandPart = inputValue.trim();
        const response = suggestions.join(' ');
        setOutput((prevOutput) => [
          ...prevOutput,
          { promptPart, commandPart, response }
        ]);
      }
    }
  };

  return {
    inputValue,
    output,
    prompt,
    currentPath,
    handleInputChange,
    handleSubmit,
    handleKeyDown,
    inputRef
  };
};

const findItem = (name: string, directory: FileSystemItem[]): FileSystemItem | undefined => {
  return directory.find(item => item.name === name);
};

export default useCommandHandler;
