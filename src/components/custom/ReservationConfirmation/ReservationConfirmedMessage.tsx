import React, { useState } from "react";
import ReservationDialog from "./ReservationDialog";
import { AutoCancelNotification } from "./AutoCancelNotification";
import { useReservationTimer } from "./hooks/useReservationTimer";

interface ReservationConfirmedMessageProps {
  pickupDate?: Date;
  returnDate?: Date;
  id: string;
  marca: string;
  modelo: string;
  precio: number;
}

export default function ReservationConfirmedMessage({
  pickupDate,
  returnDate,
  id,
  marca,
  modelo,
  precio,
}: ReservationConfirmedMessageProps) {
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const {
    timeLeft,
    confirmed,
    autoCancelled,
    startTimer,
    cancelReservation,
    setAutoCancelled,
  } = useReservationTimer(12 * 60 * 60 * 1000);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowDialog(true);
    }, 1000);
  };

  const formatTime = (ms: number, detailed = true) => {
    const hours = Math.floor((ms % (1000 * 60 * 60 * 48)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return detailed
      ? `${hours}h ${minutes}m ${seconds}s`
      : `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };
  console.log("estamos en Reservation");
  return (
    <>
      <ReservationDialog
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        loading={loading}
        handleClick={handleClick}
        handleConfirm={startTimer}
        confirmed={confirmed}
        handleCancelReservation={cancelReservation}
        timeLeft={timeLeft}
        formatTime={formatTime}
        pickupDate={pickupDate}
        returnDate={returnDate}
        id={id}
        marca={marca}
        modelo={modelo}
        precio={precio}
      />

      {autoCancelled && (
        <AutoCancelNotification onClose={() => setAutoCancelled(false)} />
      )}
    </>
  );
}