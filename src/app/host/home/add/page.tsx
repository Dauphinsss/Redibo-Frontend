"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AddDireccion() {
  return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      <Link href="/host/pages">
      <Button variant="secondary" className="flex items-center gap-2 self-start w-full justify-start cursor-pointer">
          <ChevronLeft className="h-4 w-4" />
          Volver
        </Button>
      </Link>
    </div>
  );
}