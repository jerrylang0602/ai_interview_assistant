
import { useState, useEffect, useCallback } from 'react';

export const useInterviewTimer = (durationMinutes: number, onExpire: () => void) => {
  const [timeRemaining, setTimeRemaining] = useState(durationMinutes * 60); // Convert to seconds
  const [isExpired, setIsExpired] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const startTimer = useCallback(() => {
    console.log(`Starting interview timer for ${durationMinutes} minutes`);
    setIsStarted(true);
  }, [durationMinutes]);

  useEffect(() => {
    if (!isStarted || isExpired) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isStarted, isExpired, onExpire]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return {
    timeRemaining,
    isExpired,
    isStarted,
    startTimer,
    formattedTime: formatTime(timeRemaining)
  };
};
