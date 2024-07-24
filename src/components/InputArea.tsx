import React, { useState, useEffect, useRef } from 'react';
import { getTerminalPrompt } from '../utils/getTerminalPrompt';
import OutputArea from './OutputArea';
import { getResponseForCommand } from '../utils/commands';
import useAutoFocus from '../hooks/useAutoFocus';

const InputArea: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [output, setOutput] = useState<{ promptPart: string; commandPart: string; response: string }[]>([]);
  const [prompt, setPrompt] = useState<string>('Loading prompt...');
  const [currentPath, setCurrentPath] = useState<string>('/'); // Track the current directory path
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

    if (command === 'clear') {
      setOutput([]);
      setInputValue('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }

    // Update the current path if needed
    const updatedPath = response?.startsWith('/') ? response : currentPath;
    if (updatedPath !== currentPath) {
      setCurrentPath(updatedPath);
    }

    // Construct the command part and prompt part
    const commandPart = inputValue.trim();
    const promptPart = `${prompt}${currentPath.trim()}#`;

    setOutput((prevOutput) => [
      ...prevOutput,
      { promptPart, commandPart, response: response! }
    ]);
    setInputValue('');

    if (inputRef.current) {
      inputRef.current.focus();
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
          className="terminal-input"
          autoFocus
        />
      </form>
    </div>
  );
};

export default InputArea;
