import React, { useEffect } from "react";

// Credits: Craig feldmann
// GitHub Link: https://github.com/craig-feldman

type WelcomeMessageProps = {
  message: string;
  inputRef: React.RefObject<HTMLInputElement>;
};

const WelcomeMessage: React.FC<WelcomeMessageProps> = (props) => {
  const welcomeMessageRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.inputRef.current) {
      props.inputRef.current.disabled = true;
    }

    let index = 0;
    const typeText = setInterval(() => {
      if (!welcomeMessageRef.current) {
        return;
      }

      welcomeMessageRef.current.insertAdjacentText("beforeend", props.message.charAt(index));
      index++;

      if (index === props.message.length) {
        clearInterval(typeText);
        if (props.inputRef.current) {
          props.inputRef.current.disabled = false;
          props.inputRef.current.focus();
        }
      }
    }, 30);

    return () => clearInterval(typeText);
  }, [props.inputRef, props.message]);

  return <div ref={welcomeMessageRef} className="terminal-welcome-message"></div>;
};

export default WelcomeMessage;
