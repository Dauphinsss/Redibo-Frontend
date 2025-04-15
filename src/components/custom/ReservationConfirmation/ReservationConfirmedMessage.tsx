import React, { useState } from "react";
import ReservationDialog from "./ReservationDialog";
import { FloatingTimer } from "./FloatingTimer";
import { AutoCancelNotification } from "./AutoCancelNotification";
import { useReservationTimer } from "./hooks/useReservationTimer";

interface ReservationConfirmedMessageProps {
  user: {
    id: number;
    nombre: string;
    ciudad: string;
    correo: string;
    telefono: number;
  };
  pickupDate?: Date;
  returnDate?: Date;
}

export default function ReservationConfirmedMessage({
  user,
  pickupDate,
  returnDate,
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
  } = useReservationTimer(48 * 60 * 60 * 1000);

  const vehicle = {
    id: 9,
    marca: "Toyota",
    modelo: "Corolla 2021",
    precio: "Bs. 500",
  };

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

  return (
    <>
      <ReservationDialog
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        loading={loading}
        handleClick={handleClick}
        handleConfirm={startTimer} //es lo importante para iniciar el reloj
        confirmed={confirmed}
        handleCancelReservation={cancelReservation}
        user={user}
        vehicle={vehicle}
        timeLeft={timeLeft}
        formatTime={formatTime}
        pickupDate={pickupDate}
        returnDate={returnDate}
      />

      {autoCancelled && (
        <AutoCancelNotification onClose={() => setAutoCancelled(false)} />
      )}
    </>
  );
}
