"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OrdersManagement() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Órdenes de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 6H3"></path>
                <path d="M10 12H3"></path>
                <path d="M3 18H21"></path>
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Contenido Vacío</h3>
            <p className="text-gray-500">
              La funcionalidad de gestión de órdenes de pago estará disponible pronto.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}