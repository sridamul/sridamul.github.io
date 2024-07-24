import React, { useState, useEffect, useRef } from 'react';
import { getTerminalPrompt } from '../utils/getTerminalPrompt';
import OutputArea from './OutputArea';
import { getResponseForCommand, handleArrowKey } from '../utils/commands';
import { getAutocompleteSuggestions, getCdSuggestions, getCatSuggestions } from '../utils/autocomplete';
import useAutoFocus from '../hooks/useAutoFocus';
import { FileSystemItem, fileSystem as rootFileSystem } from '../fileSystem/fileSystem';

const InputArea: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [output, setOutput] = useState<{ promptPart: string; commandPart: string; response: string }[]>([]);
  const [prompt, setPrompt] = useState<string>('Loading prompt...');
  const [currentDirectory, setCurrentDirectory] = useState<FileSystemItem[]>(rootFileSystem);
  const [currentPath, setCurrentPath] = useState<string>('/');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const command = inputValue.trim().toLowerCase();
    const response = getResponseForCommand(command);

    const commandPart = inputValue.trim();
    const promptPart = `${prompt}${currentPath.trim()}#`;

    if (command === 'clear') {
      setOutput([]);
      setInputValue('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }

    if (command.startsWith('cd')) {
      const updatedPath = response?.startsWith('/') ? response : currentPath;
      if (updatedPath !== currentPath) {
        setCurrentPath(updatedPath);
        setOutput((prevOutput) => [
          ...prevOutput,
          { promptPart, commandPart, response: '' }
        ]);      
        // Update current directory
        const newDir = response?.startsWith('/') ? response.slice(1).split('/') : [];
        let newCurrentDirectory: FileSystemItem[] = rootFileSystem;
        for (const dir of newDir) {
          const foundDir = newCurrentDirectory.find(item => item.name === dir && item.type === 'directory');
          if (foundDir && foundDir.children) {
            newCurrentDirectory = foundDir.children;
          } else {
            newCurrentDirectory = [];
            break;
          }
        }
        setCurrentDirectory(newCurrentDirectory);
      } else {
        setOutput((prevOutput) => [
          ...prevOutput,
          { promptPart, commandPart, response: response! }
        ]);
      }
      setInputValue('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }

    const updatedPath = response?.startsWith('/') ? response : currentPath;
    if (updatedPath !== currentPath) {
      setCurrentPath(updatedPath);
    }

    setOutput((prevOutput) => [
      ...prevOutput,
      { promptPart, commandPart, response: response! }
    ]);
    setInputValue('');

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const previousCommand = handleArrowKey('up');
      setInputValue(previousCommand);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextCommand = handleArrowKey('down');
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

  return (
    <div className="input-area">
      <OutputArea output={output} />
      <form onSubmit={handleSubmit} className="input-form">
        <span className="terminal-prompt">{prompt} {currentPath.trim()}#</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="terminal-input"
          autoFocus
        />
      </form>
    </div>
  );
};

export default InputArea;
