import React from 'react';

interface OutputProps {
  output: { promptPart: string; commandPart: string; response: string }[];
}

const OutputArea: React.FC<OutputProps> = ({ output }) => {
  return (
    <div className="output-area">
      {output.map((entry, index) => {
        const isValidCommand = !entry.response.includes('Command not found');

        return (
          <div key={index} className="terminal-output-entry">
            <span className="terminal-prompt">{entry.promptPart}</span>
            <span className={isValidCommand ? 'terminal-command-valid' : 'terminal-command-invalid'}>
              {entry.commandPart}
            </span>
            <br />
            <span className="terminal-response" dangerouslySetInnerHTML={{ __html: entry.response }} />
          </div>
        );
      })}
    </div>
  );
};

export default OutputArea;
