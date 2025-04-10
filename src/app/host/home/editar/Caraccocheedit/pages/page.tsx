import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const seats = [{ label: "5", value: "5" }];
const trans = [{ label: "MECÁNICA", value: "MECÁNICA" }];
const drs = [{ label: "5", value: "5" }];

const items = [
  {
    id: "gasoline",
    label: "Gasolina",
  },
  {
    id: "gvn",
    label: "GVN",
  },
  {
    id: "electric",
    label: "Eléctrico",
  },
  {
    id: "diesel",
    label: "Diesel",
  },
] as const;

const SprinterosPage: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        overflow: "hidden", // Evita el scroll
      }}
    >
      <div
        style={{
          textAlign: "left",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h2
          style={{
            fontSize: "40px",
            marginBottom: "20px",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Características del coche
        </h2>

        <label style={{ fontFamily: "Inter, sans-serif" }}>
          Tipo de combustible
        </label>
        <div style={{ marginBottom: "10px" }}>
          {items.map((item, index) => (
            <div key={item.id} style={{ marginBottom: "5px" }}>
              <Checkbox id={item.id} />
              <label
                htmlFor={item.id}
                style={{
                  marginLeft: "8px",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {item.label}
              </label>
            </div>
          ))}
        </div>

        <label style={{ fontFamily: "Inter, sans-serif" }}>Asientos</label>
        <select
          style={{
            border: "2px solid #000000",
            borderRadius: "8px",
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
          }}
        >
          {seats.map((seat) => (
            <option key={seat.value} value={seat.value}>
              {seat.label}
            </option>
          ))}
        </select>

        <label style={{ fontFamily: "Inter, sans-serif" }}>Puertas</label>
        <select
          style={{
            border: "2px solid #000000",
            borderRadius: "8px",
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
          }}
        >
          {drs.map((dr) => (
            <option key={dr.value} value={dr.value}>
              {dr.label}
            </option>
          ))}
        </select>

        <label style={{ fontFamily: "Inter, sans-serif" }}>Transmisión</label>
        <select
          style={{
            border: "2px solid #000000",
            borderRadius: "8px",
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
          }}
        >
          {trans.map((tran) => (
            <option key={tran.value} value={tran.value}>
              {tran.label}
            </option>
          ))}
        </select>

        <label style={{ fontFamily: "Inter, sans-serif" }}>Seguro</label>
        <div style={{ marginBottom: "20px" }}>
          <Checkbox id="soat" />
          <label
            htmlFor="soat"
            style={{ marginLeft: "8px", fontFamily: "Inter, sans-serif" }}
          >
            SOAT
          </label>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="outline">CANCELAR</Button>
          <Button variant="outline">FINALIZA EDICIÓN Y GUARDAR</Button>
        </div>
      </div>
    </div>
  );
};

export default SprinterosPage;