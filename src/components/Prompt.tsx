import React from 'react';

interface PromptProps {
  prompt: string;
  currentPath: string;
}

const Prompt: React.FC<PromptProps> = ({ prompt, currentPath }) => {
  return (
    <span className="terminal-prompt">
        {prompt} {currentPath.trim()}#
    </span>
  );
};

export default Prompt;
