"use client";

import Header from "@/components/ui/Header";
import DriverApplicationForm from "./driver-application-form";
import { Footer } from "@/components/ui/footer";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConductorPage() {
  const router = useRouter();

  useEffect(() => {
    const storedState = localStorage.getItem("estadoConductor");
    if (storedState === null) {
      router.push("/");
      return;
    }
    if (storedState === "NO_REQUESTED") return
    router.push("/");
    
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <DriverApplicationForm />
      <Footer />
    </div>
  );
}
