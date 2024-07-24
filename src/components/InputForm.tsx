import React from 'react';

interface InputFormProps {
  inputValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const InputForm: React.FC<InputFormProps> = ({ inputValue, onChange, onSubmit, onKeyDown, inputRef }) => {
  return (
    <form onSubmit={onSubmit} className="input-form">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="terminal-input"
        autoFocus
      />
    </form>
  );
};

export default InputForm;
