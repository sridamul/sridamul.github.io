import React from 'react';

interface OutputProps {
  output: { command: string; response: string }[];
}

const OutputArea: React.FC<OutputProps> = ({ output }) => {
  return (
    <div className="output-area">
      {output.map((entry, index) => {
        const [promptPart, commandPartWithRest] = entry.command.split('#');
        const commandPart = commandPartWithRest?.trim().split(' ')[0] || '';
        const isValidCommand = !entry.response.includes('Command not found');

        return (
          <div key={index} className="terminal-output-entry">
            <span className="terminal-prompt">{promptPart}# </span>
            <span className={isValidCommand ? 'terminal-command-valid' : 'terminal-command-invalid'}>
              {commandPart}
            </span>
            <br />
            <span className="terminal-response">{entry.response}</span>
          </div>
        );
      })}
    </div>
  );
};

export default OutputArea;
