"use client";

import Header from "@/components/ui/Header";
import DriverApplicationForm from "./driver-application-form";
import { Footer } from "@/components/ui/footer";

export default function ConductorPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <DriverApplicationForm />;
      <Footer />
    </div>
  );
}
