"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function LoginForm() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Iniciando sesión con:", { email, password });
};

return (
    <div className="w-full max-w-md mx-auto p-8 rounded-xl bg-card text-card-foreground shadow-lg border border-border">
        <h2 className="text-2xl font-bold text-center mb-8">
        Inicia sesión en REDIBO
        </h2>

    <form onSubmit={handleLogin} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
        <Label htmlFor="email" className="text-sm font-medium">
            Correo electrónico 
        </Label>
        <Input
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
            className="h-10 px-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        </div>

        <div className="flex flex-col gap-1">
        <Label htmlFor="password" className="text-sm font-medium">
            Contraseña 
        </Label>
        <Input
            id="password"
            type="password"
            placeholder="Ingrese su contraseña"
            className="h-10 px-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        </div>

        <Button type="submit" className="w-full h-10">
        Continuar
        </Button>
    </form>

        <div className="my-8 flex items-center justify-center text-muted-foreground">
            <hr className="flex-grow border-border" />
            <span className="mx-4">o</span>
            <hr className="flex-grow border-border" />
        </div>

        <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center gap-2 h-10"
        >
        <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="w-5 h-5"
        />
        Iniciar sesión con Google
        </Button>

        <p className="text-sm text-center mt-8 text-muted-foreground">
        ¿No tienes una cuenta?{" "}
        <a href="/registro" className="text-primary hover:underline">
        Regístrate
        </a>
        </p>
    </div>
);
}
