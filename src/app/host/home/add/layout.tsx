// app/host/home/add/layout.tsx
"use client";

import { FormProvider } from "./context/FormContext";

export default function AddLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FormProvider>
      <div className="bg-gray-100 min-h-screen">
        {children}
      </div>
    </FormProvider>
  );
}