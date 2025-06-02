"use client";

import Header from "@/components/ui/Header";
import DriverApplicationForm from "./driver-application-form";
import { Footer } from "@/components/ui/footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ConductorPage() {
  const [estado, setEstado] = useState("NO_REQUESTED");
  const router = useRouter();

  useEffect(() => {
    const storedState = localStorage.getItem("estadoConductor");
    if (storedState) {
      setEstado(storedState);
    }
    if (estado !== "REQUESTED") {
      router.push("/");
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <DriverApplicationForm />
      <Footer />
    </div>
  );
}
