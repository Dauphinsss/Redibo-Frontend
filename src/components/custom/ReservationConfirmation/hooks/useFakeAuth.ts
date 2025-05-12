import { useState } from "react";

type User = {
  id: number;
  nombre: string;
  ciudad: string;
  correo: string;
  telefono: number;
};

export function useFakeAuth() {
  const [user, setUser] = useState<User | null>(null);

  const login = () => {
    // Simulao que el usuario se loguea y recibe un id
    const fakeUser = {
      id: 2,         // id usuario
      nombre: "Cinthia Montaño Fuentes",  // nombre usuario
      ciudad: "Cochabamba",
      correo: "cinthia.mont@gmail.com",
      telefono: 71744172
    };
    setUser(fakeUser);
  };

  const logout = () => setUser(null);

  return { user, login, logout };
}
