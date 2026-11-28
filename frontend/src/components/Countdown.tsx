import { useEffect, useRef, useState } from 'react';

interface CountdownProps {
  remainingSeconds: number; // the server's number, re-sent after every save
  onExpire: () => void;
}

function format(total: number): string {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function Countdown({ remainingSeconds, onExpire }: CountdownProps) {
  const [secondsLeft, setSecondsLeft] = useState(remainingSeconds);
  const onExpireRef = useRef(onExpire);
  const firedRef = useRef(false);

  // Always call the latest onExpire, never a stale copy
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  // Runs on mount and every time the server sends a new remainingSeconds
  useEffect(() => {
    const deadline = Date.now() + remainingSeconds * 1000;

    function tick() {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left === 0 && !firedRef.current) {
        firedRef.current = true;
        onExpireRef.current();
      }
    }

    tick();
    const intervalId = setInterval(tick, 500);
    return () => clearInterval(intervalId);
  }, [remainingSeconds]);

  return (
    <p className={`timer${secondsLeft <= 60 ? ' low' : ''}`}>
      Time left: {format(secondsLeft)}
    </p>
  );
}
