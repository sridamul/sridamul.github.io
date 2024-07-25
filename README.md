# Personal Terminal Website

> [!Note]
> Work in progress


## Getting Started

This project uses React and TypeScript with Vite for configuration.

### Requirements
The following versions are currently used in this project:
- Node.js: 22.5.1
- npm: 10.8.2

### Fork and Clone the Repo
1. Fork this repository to your GitHub account.
2. Clone the forked repository to your local machine using:
   
   ```bash
   git clone https://github.com/<your-username>/sridamul.github.io
   ```

### Install the dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```
## Features

- **File System**: Mocked a simple file system and allows the user to navigate between them.
- **Various Commands**: Allows the user to explore the terminal smoothly.
- **Tab Autocompletion**: Autocompletion of command, directory, and file names using the tab key.
- **Cursor Autofocus**: Automatically focuses back on the input box if the user starts typing, even if the cursor is clicked somewhere else.
- **Maintaining Histor**y: Maintains a history of commands used and allows the user to switch between them using the up and down arrow keys
- **Customizing the Terminal**: Commands like setBg can be used to customize the background color.
- **Manual Pages**: Small descriptions about each command.
- **Rendering Markdown**: Supports rendering Markdown content within the terminal.

## Available commands

- **cat** - Displays the contents of a file. Usage: cat &lt;file&gt;
- **cd** - Changes the current directory. Usage: cd &lt;directory&gt;
- **clear** - Clears the terminal screen.
- **compgen** - Lists all available commands.
- **date** - Displays the current date and time.
- **github** - Opens the GitHub page in a new tab.
- **history** - Displays the list of history of commands used.
- **help** - Displays a help message.
- **ls** - Lists the contents of the current directory.
- **man** - Displays the manual page for a command. Usage: man &lt;command&gt;
- **setbg** - Changes the background color of the terminal. Usage: setBg &lt;color&gt;

## Inspiration

https://craigfeldman.com/<br>
http://www.ronniepyne.com/
