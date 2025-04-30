// hooks/useReservationTimer.ts
import { useEffect, useState } from "react";

export function useReservationTimer(duration: number) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [autoCancelled, setAutoCancelled] = useState(false);

  useEffect(() => {
    if (!confirmed || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          setConfirmed(false);
          setTimeLeft(0);
          setExpiresAt(null);
          setAutoCancelled(true);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [confirmed, timeLeft]);

  useEffect(() => {
    if (confirmed && timeLeft === 0) {
      setConfirmed(false);
      setAutoCancelled(true);
      setExpiresAt(null);

      const timer = setTimeout(() => {
        setAutoCancelled(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [timeLeft, confirmed]);

  const startTimer = () => {
    setTimeLeft(duration);
    setExpiresAt(new Date(Date.now() + duration));
    setConfirmed(true);
  };

  const cancelReservation = () => {
    setConfirmed(false);
    setTimeLeft(0);
    setExpiresAt(null);
  };

  return {
    timeLeft,
    confirmed,
    expiresAt,
    autoCancelled,
    startTimer,
    cancelReservation,
    setAutoCancelled,
  };
}
