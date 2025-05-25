// app/host/home/add/layout.tsx
"use client";

import { FormProvider } from "./context/form";
import { SegurosProvider } from "./context/seguros";
export default function AddLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FormProvider>
      <SegurosProvider>
        <div className="bg-gray-100 min-h-screen">
          {children}
        </div>
      </SegurosProvider>
    </FormProvider>
  );
}