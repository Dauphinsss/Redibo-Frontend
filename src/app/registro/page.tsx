import React from "react";
import Form from "./form";
import { Footer } from "@/components/ui/footer";
import { Header } from "./header";
import { Toaster } from "@/components/ui/sonner";
import { metadata } from "../layout";

metadata.title = "Registro";

const RegistroPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <h2 className="text-2xl font-bold text-center mt-5">Registro</h2>
      <Form />
      <Footer />
      <Toaster />
    </div>
  );
};

export default RegistroPage;
