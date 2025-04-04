"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SprinterosRedirect() {
    const router = useRouter();

    useEffect(() => {
        // Aquí puedes agregar la lógica de redirección
        router.push('/sprinteros/pages');
    }, [router]);

    return null;
}