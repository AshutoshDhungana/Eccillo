import { useEffect, useRef, useState } from "react";

interface TypingCycleProps {
  prompts: string[];
  className?: string;
}

const TYPE_SPEED = 45;
const HOLD_DURATION = 1600;
const ERASE_SPEED = 20;

/**
 * Cycles through the AI Copilot prompt suggestions with a typewriter effect,
 * reproducing the intent of the imported `typing_clip` frames responsively.
 * Falls back to a static prompt when reduced motion is preferred.
 */
export function TypingCycle({ prompts, className = "" }: TypingCycleProps) {
  const [text, setText] = useState("");
  const [reduced, setReduced] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) {
      setText(prompts[0] ?? "");
      return;
    }
    let timeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const typePrompt = () => {
      const current = prompts[indexRef.current % prompts.length];
      let i = 0;

      const type = () => {
        if (cancelled) return;
        setText(current.slice(0, i));
        if (i < current.length) {
          i += 1;
          timeout = setTimeout(type, TYPE_SPEED);
        } else {
          timeout = setTimeout(erase, HOLD_DURATION);
        }
      };

      const erase = () => {
        if (cancelled) return;
        setText(current.slice(0, i));
        if (i > 0) {
          i -= 1;
          timeout = setTimeout(erase, ERASE_SPEED);
        } else {
          indexRef.current += 1;
          timeout = setTimeout(typePrompt, 300);
        }
      };

      type();
    };

    typePrompt();
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [prompts, reduced]);

  return (
    <span className={className}>
      {text}
      {!reduced && (
        <span className="ml-0.5 inline-block w-px animate-pulse align-middle text-current">
          |
        </span>
      )}
    </span>
  );
}
