import { useTypewriter } from "@/hooks/useTypewriter";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

const TypewriterText = ({
  text,
  speed = 25,
  delay = 0,
  className = "",
  onComplete,
}: TypewriterTextProps) => {
  const { displayedText, isComplete } = useTypewriter({
    text,
    speed,
    delay,
    onComplete,
  });

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && (
        <span className="inline-block w-0.5 h-4 bg-foreground/70 ml-0.5 animate-pulse" />
      )}
    </span>
  );
};

export default TypewriterText;
