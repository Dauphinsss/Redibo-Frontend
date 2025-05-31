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
      const response = await axios.get<Transaccion[]>(`${API_URL}/api/get-transacciones`);
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Error al obtener las transacciones");
      setTransactions([]);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="space-y-6">
      <AdminTransactions transactions={transactions}/>
    </div>
  );
}