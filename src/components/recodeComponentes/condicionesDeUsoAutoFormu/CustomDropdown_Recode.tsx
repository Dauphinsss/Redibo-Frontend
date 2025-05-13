"use client";

import React, { forwardRef } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export interface Option<T> {
  value: T;
  label: string;
}

interface CustomDropdownProps<T> {
  options: Option<T>[];
  value: Option<T>;
  onChange: (value: Option<T>) => void;
}

const CustomDropdown_Recode = forwardRef<HTMLButtonElement, CustomDropdownProps<string>>(
  ({ options, value, onChange }, ref) => {
    return (
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button
            ref={ref}
            className="relative w-full cursor-default rounded-md border border-black bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-1 focus:ring-black text-sm"
          >
            <span className={`block truncate ${value.value === "" ? "text-gray-400" : ""}`}>
              {value.label}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon className="h-5 w-5 text-black" aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
            {options
              .filter((opt) => opt.value !== "") // opcional: evita mostrar el placeholder otra vez
              .map((opt) => (
                <Listbox.Option
                  key={String(opt.value)}
                  value={opt}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-black text-white" : "text-gray-900"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
                      >
                        {opt.label}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                          ✔
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
          </Listbox.Options>
        </div>
      </Listbox>
    );
  }
);

CustomDropdown_Recode.displayName = "CustomDropdown_Recode";
export default CustomDropdown_Recode;
