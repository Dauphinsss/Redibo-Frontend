import React, { useState } from "react";
import ReservationDialog from "./ReservationDialog";
import { AutoCancelNotification } from "./AutoCancelNotification";
import { useReservationTimer } from "./hooks/useReservationTimer";

interface ReservationConfirmedMessageProps {
  /*user: {
    id: number;
    nombre: string;
    ciudad: string;
    correo: string;
    telefono: number;
  };*/
  pickupDate?: Date;
  returnDate?: Date;
  id: string;
  marca:string;
  modelo:string;
  precio:number;
}

export default function ReservationConfirmedMessage({
  //user,
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
  } = useReservationTimer(48 * 60 * 60 * 1000);

  const vehicle = {
    id: 1,
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
  console.log("estamos en Reservation");
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
        //user={user}
       
        timeLeft={timeLeft}
        formatTime={formatTime}
        pickupDate={pickupDate}
        returnDate={returnDate}
        id={id}
        marca={marca}
        modelo={modelo}
        precio = {precio}
      />

      {autoCancelled && (
        <AutoCancelNotification onClose={() => setAutoCancelled(false)} />
      )}
    </>
  );
}
      /*showDialog: boolean;
      setShowDialog: (val: boolean) => void;
      loading: boolean;
      handleClick: () => void;
      handleConfirm: () => void;
      confirmed: boolean;
      handleCancelReservation: () => void;
      timeLeft: number;
      formatTime: (ms: number, detailed?: boolean) => string;*/