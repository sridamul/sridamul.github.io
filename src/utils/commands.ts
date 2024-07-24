type Command = 'compgen' | 'help' | 'greet' | 'clear';

const commands: Record<Command, string | null> = {
  compgen: 'Available commands: compgen, help, greet, clear',
  help: 'Type a command and press Enter. Use "compgen" to list all commands.',
  greet: 'Hello! How can I assist you today?',
  clear: null,
};

const isCommand = (command: string): command is Command => {
  return command in commands;
};

export const getResponseForCommand = (command: string): string | null => {
  if (isCommand(command)) {
    return commands[command];
  }
  return 'Command not found. Type "compgen" for a list of commands.';
};
