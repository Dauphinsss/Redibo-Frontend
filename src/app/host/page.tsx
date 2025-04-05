"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function hostRedirect() {
    const router = useRouter();

    useEffect(() => {
        // Aquí puedes agregar la lógica de redirección
        router.push('/host/pages');
    }, [router]);

    return null;
}