import React from 'react';
import Prompt from './Prompt';
import InputForm from './InputForm';
import OutputArea from './OutputArea';
import useCommandHandler from '../hooks/useCommandHandler';

const InputArea: React.FC = () => {
  const {
    inputValue,
    output,
    prompt,
    currentPath,
    handleInputChange,
    handleSubmit,
    handleKeyDown,
    inputRef
  } = useCommandHandler();

  return (
    <div className="input-area">
      <OutputArea output={output} />
      <div className="input-wrapper">
        <Prompt prompt={prompt} currentPath={currentPath} />
        <InputForm
          inputValue={inputValue}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          inputRef={inputRef}
        />
      </div>
    </div>
  );
};

export default InputArea;
