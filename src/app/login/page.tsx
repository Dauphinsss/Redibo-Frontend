"use client";

import { Header } from "./header";
import { LoginForm } from "./loginForm";

export default function LoginPage() {
return (
    <>
    <Header />
    <main className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <LoginForm />
    </main>
    </>
);
}
