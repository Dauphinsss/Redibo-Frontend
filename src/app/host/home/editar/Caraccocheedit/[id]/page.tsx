import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

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
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      {/* Título */}
      <div className="w-full max-w-5xl flex justify-start">
        <h1 className="text-4xl font-bold my-5 pl-7">Características del coche</h1>
      </div>
      {/* Formulario */}
      <div className="w-full max-w-5xl pl-13">
        {/* Tipo de combustible */}
        <div className="w-full flex flex-col mt-4">
          <label className="text-lg font-semibold mb-2">Tipo de combustible</label>
          <div className="mt-2 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-center mb-2">
                <Checkbox id={item.id} />
                <label htmlFor={item.id} className="ml-2 text-base">
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Asientos */}
        <div className="w-full flex flex-col mt-4">
          <label className="text-lg font-semibold mb-1">Asientos</label>
          <Select>
            <SelectTrigger className="w-[600px] mt-2 border-2  rounded-md">
              <SelectValue placeholder="Seleccione número de asientos">
                {seats[0].label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {seats.map((seat) => (
                  <SelectItem key={seat.value} value={seat.value}>
                    {seat.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Puertas */}
        <div className="w-full flex flex-col mt-6">
          <label className="text-lg font-semibold mb-1">Puertas</label>
          <Select>
            <SelectTrigger className="w-[600px] mt-2 border-2 rounded-md">
              <SelectValue placeholder="Seleccione número de puertas">
                {drs[0].label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {drs.map((dr) => (
                  <SelectItem key={dr.value} value={dr.value}>
                    {dr.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Transmisión */}
        <div className="w-full flex flex-col mt-6">
          <label className="text-lg font-semibold mb-1">Transmisión</label>
          <Select>
            <SelectTrigger className="w-[600px] mt-2 border-2 rounded-md">
              <SelectValue placeholder="Seleccione tipo de transmisión">
                {trans[0].label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {trans.map((tran) => (
                  <SelectItem key={tran.value} value={tran.value}>
                    {tran.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Seguro */}
        <div className="w-full flex flex-col mt-6">
          <label className="text-lg font-semibold mb-2">Seguro</label>
          <div className="flex items-center mt-2">
            <Checkbox id="soat" />
            <label htmlFor="soat" className="ml-2 text-base">
              SOAT
            </label>
          </div>
        </div>
      </div>

      {/* Sección de Botones */}
      <div className="w-full max-w-5xl flex justify-between items-center mt-10 px-10">
        <Button 
          variant="secondary"
          className="w-[160px] h-12 text-lg font-semibold transition-all duration-200 hover:bg-gray-100 hover:brightness-90"
        >
          CANCELAR
        </Button>
        
        <Button 
          variant="default"
          className="h-12 text-lg font-semibold text-white px-6"
        >
          FINALIZAR EDICIÓN Y GUARDAR
        </Button>
      </div>
    </div>
  );
};

export default SprinterosPage;