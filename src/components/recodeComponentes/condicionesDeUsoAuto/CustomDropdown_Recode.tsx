import React, { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/solid'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'

export interface Option<T> {
  value: T
  label: string
}

export interface CustomDropdownRecodeProps<T> {
  options: Option<T>[]
  value: Option<T>
  onChange: (selection: Option<T>) => void
  label?: string
}

function CustomDropdown_Recode<T>({
  options,
  value,
  onChange,
  label
}: CustomDropdownRecodeProps<T>) {
  return (
    <div className="w-full">
      {label && <span className="block mb-1 font-semibold">{label}</span>}
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="
            relative w-full cursor-pointer rounded border border-black bg-white
            px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-black
            flex justify-between items-center
          ">
            <span className="block truncate">{value.label}</span>
            <ChevronUpDownIcon className="h-5 w-5 text-black" aria-hidden="true" />
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              as="ul"
              className="
                absolute mt-1 max-h-60 w-full overflow-auto rounded bg-white
                py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5
                focus:outline-none z-10
              "
            >
              {options.map(opt => (
                <Listbox.Option
                  key={String(opt.value)}
                  value={opt}
                  as="li"
                  className={({ active }) =>
                    `cursor-pointer select-none px-3 py-2 flex items-center ${
                      active ? 'bg-gray-100 text-black' : 'text-gray-800'
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      {selected && (
                        <CheckIcon
                          className="h-5 w-5 mr-2 text-black"
                          aria-hidden="true"
                        />
                      )}
                      <span className={selected ? 'font-medium' : 'font-normal'}>
                        {opt.label}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default CustomDropdown_Recode
