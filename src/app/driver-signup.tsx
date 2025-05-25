"use client";

import { Button } from "@/components/ui/button";
import { Car, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Driver() {
  return (
    <div className="w-full bg-gradient-to-r ">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Car className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                ¿Eres conductor?
              </h3>
              <p className="text-sm text-gray-600">
                Genera ingresos extra en tu tiempo libre
              </p>
            </div>
          </div>

          <Link href="/driver-signup">
            <Button className="flex items-center gap-2 whitespace-nowrap">
              Convertirse ahora
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
