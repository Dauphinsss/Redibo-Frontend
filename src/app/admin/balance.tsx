"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BalanceManagement() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Saldo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="12" y1="12" x2="12" y2="12"></line>
                <path d="M2 10h20"></path>
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Contenido Vacío</h3>
            <p className="text-gray-500">
              La funcionalidad de gestión de saldo estará disponible pronto.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}