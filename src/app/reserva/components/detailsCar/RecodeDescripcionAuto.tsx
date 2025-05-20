interface DescripcionAutoProps {
    descripcion: string;
}

export default function DescripcionAuto({ descripcion }: DescripcionAutoProps) {
    return (
        <section className="w-full">
            <h2 className="text-2xl font-bold mb-4">Acerca de este auto</h2>
            <p className="text-gray-600 mb-6">
                {descripcion}
            </p>
        </section>
    );
}