import { useEffect, RefObject } from 'react';

const useAutoFocus = (inputRef: RefObject<HTMLInputElement>) => {
  useEffect(() => {
    const handleKeydown = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [inputRef]);
};

export default useAutoFocus;
