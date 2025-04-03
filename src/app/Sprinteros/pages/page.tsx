"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";


const years = [
  { label: "2025", value: "2025" },
  { label: "2024", value: "2024" },
  { label: "2023", value: "2023" },
  { label: "2022", value: "2022" },
  { label: "2021", value: "2021" },
  { label: "2020", value: "2020" },
];

const brands = [
  { label: "Cochabamba", value: "marca 1" },
  { label: "La Paz", value: "marca 2" },
  { label: "Santa Cruz", value: "marca 3" },
];

const models = [
  { label: "Quillacollo", value: "quillacollo" },
  { label: "Chapare", value: "chapare" },
  { label: "Punata", value: "punata" },
];

const SprinterosPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = React.useState("");
  const [selectedBrand, setSelectedBrand] = React.useState("");
  const [selectedModel, setSelectedModel] = React.useState("");

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h2>Datos principales</h2>
        
        <label>Numero Vim</label>
        <br />
        <textarea
          placeholder="Ingrese el numero Vim"
          style={{
            width: "300px",
            height: "50px",
            marginBottom: "10px",
            resize: "none",
            borderColor: "black",
            borderWidth: "2px",
          }}
        ></textarea>
        <br />





        {/* Año del coche */}


        <label>Año del coche</label>
        <br />



        <select
  value={selectedYear}
  onChange={(e) => setSelectedYear(e.target.value)}
  style={{
    width: "300px",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginBottom: "10px",
  }}
>
  <option value="" disabled>
    Seleccione un año
  </option>
  {years.map((year) => (
    <option key={year.value} value={year.value}>
      {year.label}
    </option>
  ))}
</select>


        <br />






        {/* Marca */}
        <label>Marca</label>
        <br />
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-[300px] justify-between",
                !selectedBrand && "text-muted-foreground"
              )}
            >
              {selectedBrand ? selectedBrand : "Seleccione una marca"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandList>
                <CommandEmpty>No brand found.</CommandEmpty>
                <CommandGroup>
                  {brands.map((brand) => (
                    <CommandItem
                      key={brand.value}
                      onSelect={() => setSelectedBrand(brand.value)}
                    >
                      {brand.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          brand.value === selectedBrand
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>



        <br />





        {/* Modelo */}
        <label>Modelo</label>
        <br />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-[300px] justify-between",
                !selectedModel && "text-muted-foreground"
              )}
            >
              {selectedModel ? selectedModel : "Seleccione un modelo"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandList>
                <CommandEmpty>No model found.</CommandEmpty>
                <CommandGroup>
                  {models.map((model) => (
                    <CommandItem
                      key={model.value}
                      onSelect={() => setSelectedModel(model.value)}
                    >
                      {model.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          model.value === selectedModel
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <br />

        <label>Placa</label>
        <br />
        <textarea
          placeholder="Ingrese el número de placa"
          style={{
            width: "300px",
            height: "50px",
            marginBottom: "10px",
            resize: "none",
          }}
        ></textarea>
        <br />

        <Button variant="outline">CANCELAR</Button>
        <Button variant="outline">FINALIZA EDICIÓN Y GUARDAR</Button>
      </div>
    </div>
  );
};

export default SprinterosPage;

