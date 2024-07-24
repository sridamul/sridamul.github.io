import React, { useState, useEffect, useRef } from 'react';
import { getTerminalPrompt } from '../utils/getTerminalPrompt'; // Import the helper function
import OutputArea from './OutputArea'; // Import the new component

const InputArea: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [output, setOutput] = useState<{ command: string; response: string }[]>([]);
  const [prompt, setPrompt] = useState<string>('Loading prompt...');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchPrompt = async () => {
      const promptText = await getTerminalPrompt();
      setPrompt(promptText);
    };

    fetchPrompt();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const command = inputValue.trim().toLowerCase();
    let response: string | null = null;

    switch (command) {
      case 'compgen':
        response = 'Available commands: compgen, help, greet, clear';
        break;
      case 'help':
        response = 'Type a command and press Enter. Use "compgen" to list all commands.';
        break;
      case 'greet':
        response = 'Hello! How can I assist you today?';
        break;
      case 'clear':
        setOutput([]);
        setInputValue('');
        if (inputRef.current) {
          inputRef.current.focus();
        }
        return; // Return early to avoid adding the clear command to output
      default:
        response = 'Command not found. Type "compgen" for a list of commands.';
    }

    // Update output with command and response
    setOutput((prevOutput) => [
      ...prevOutput,
      { command: `${prompt}${inputValue}`, response: response! }
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
        <span className="terminal-prompt">{prompt}</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="terminal-input" // Ensure this class is styled appropriately in your CSS
          autoFocus
        />
      </form>
    </div>
  );
};

export default InputArea;
