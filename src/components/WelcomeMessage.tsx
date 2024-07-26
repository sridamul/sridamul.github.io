import React, { useEffect, useRef } from "react";

// Credits: Craig feldmann
// GitHub Link: https://github.com/craig-feldman

type WelcomeMessageProps = {
  message: string;
  inputRef: React.RefObject<HTMLInputElement>;
};

const WelcomeMessage: React.FC<WelcomeMessageProps> = (props) => {
  const welcomeMessageRef = useRef<HTMLDivElement>(null);
  const typingSoundRef = useRef<HTMLAudioElement>(new Audio('/keyboard-typing.mp3'));

  useEffect(() => {
    const typingSound = typingSoundRef.current;

    typingSound.preload = 'auto';

    const onCanPlayThrough = () => {
      if (props.inputRef.current) {
        props.inputRef.current.disabled = true;
      }

      typingSound.pause();
      typingSound.currentTime = 0;

      let index = 0;
      const typeText = setInterval(() => {
        if (!welcomeMessageRef.current) {
          return;
        }

        welcomeMessageRef.current.insertAdjacentText("beforeend", props.message.charAt(index));
        typingSound.play();
        index++;

        if (index === props.message.length) {
          clearInterval(typeText);
          if (props.inputRef.current) {
            props.inputRef.current.disabled = false;
            props.inputRef.current.focus();
          }
          typingSound.pause();
          typingSound.currentTime = 0;
        }
      }, 30);

      return () => {
        clearInterval(typeText);
        typingSound.pause();
        typingSound.currentTime = 0;
      };
    };

    typingSound.addEventListener('canplaythrough', onCanPlayThrough, { once: true });

    return () => {
      typingSound.removeEventListener('canplaythrough', onCanPlayThrough);
    };
  }, [props.inputRef, props.message]);

  return <div ref={welcomeMessageRef} className="terminal-welcome-message"></div>;
};

export default WelcomeMessage;
