import React, { useRef } from 'react';
import WelcomeMessage from './WelcomeMessage';
import InputArea from './InputArea';

const getYear = () => {
  return new Date().getFullYear();
};


const welcomeMessage = `Hi! I am Sridhar Sivakumar. Welcome to my site.
Type 'compgen' or 'help' to view all available commands.`;

const bannerCondensed = 
  " ________  _______    __     ________       __       ___      ___  ____  ____  ___       \n" +
  " /\"       )/\"      \\  |\" \\   |\"      \"\\     /\"\"\\     |\"  \\    /\"  |(\"  _||_ \" ||\"  |      \n" +
  "(:   \\___/|:        | ||  |  (.  ___  :)   /    \\     \\   \\  //   ||   (  ) : |||  |      \n" +
  " \\___  \\  |_____/   ) |:  |  |: \\   ) ||  /' /\\  \\    /\\\\  \\/.    |(:  |  | . )|:  |      \n" +
  "  __/  \\\\  //      /  |.  |  (| (___\\ || //  __'  \\  |: \\.        | \\\\ \\__/ //  \\  |___   \n" +
  " /\" \\   :)|:  __   \\  /\\  |\\ |:       :)/   /  \\\\  \\ |.  \\    /:  | /\\\\ __ //\\ ( \\_|:  \\  \n" +
  "(_______/ |__|  \\___)(__\\_|_)(________/(___/    \\___)|___|\\__/|___|(__________) \\_______) \n" +
  "  \u00A9 " + getYear();


const Home: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="home-container">
      <pre className="banner">{bannerCondensed}</pre>
      <WelcomeMessage message={welcomeMessage} inputRef={inputRef} />
      <div className="terminal-input">
        <InputArea />
      </div>
    </div>
  );
};

export default Home;