import { useState, useEffect } from "react";

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
}

export const useTypewriter = ({
  text,
  speed = 30,
  delay = 0,
  onComplete,
}: UseTypewriterOptions) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    setIsStarted(false);

    const startTimeout = setTimeout(() => {
      setIsStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, delay]);

  useEffect(() => {
    if (!isStarted) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, isStarted, onComplete]);

  return { displayedText, isComplete, isStarted };
};
