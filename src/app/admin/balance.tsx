"use client";

import axios from "axios";
import AdminTransactions, { Transaccion } from "./admin-transactions";
import { API_URL } from "@/utils/bakend";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function BalanceManagement() {
  const [transactions, setTransactions] = useState<Transaccion[]>([]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get<Transaccion[]>(
        `${API_URL}/api/get-transacciones`
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Error al obtener las transacciones");
      setTransactions([]);
    }
  };

  const aprobar = async (id: string) => {
    try {
      const response = await axios.put(`${API_URL}/api/aceptar-transaccion/${id}`);
      console.log("Transaction approved:", response.data);
      toast.success("Transacción aprobada correctamente");
      fetchTransactions(); // Refresh the list after approval
    } catch (error) {
      console.error("Error approving transaction:", error);
      toast.error("Error al aprobar la transacción");
    }
  };

  const rechazar = async (id: string) => {
    try {
      const response = await axios.put(`${API_URL}/api/rechazar-transaccion/${id}`);
      console.log("Transaction rejected:", response.data);
      toast.success("Transacción rechazada correctamente");
      fetchTransactions(); // Refresh the list after rejection
    } catch (error) {
      console.error("Error rejecting transaction:", error);
      toast.error("Error al rechazar la transacción");
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="space-y-6">
      <AdminTransactions transactions={transactions} onApprove={aprobar} onReject={rechazar}/>
    </div>
  );
}
