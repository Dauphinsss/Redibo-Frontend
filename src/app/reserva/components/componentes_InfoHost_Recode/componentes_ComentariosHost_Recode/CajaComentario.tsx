type Props = {
    valor: string;
    onCambiar: (valor: string) => void;
    onCancelar?: () => void;
    onEnviar?: () => void;
    placeholder?: string;
    className?: string;
};

const CajaComentario = ({
    valor,
    onCambiar,
    onCancelar,
    onEnviar,
    placeholder = "Escribe tu comentario...",
    className = "",
}: Props) => {
    return (
        <div className={`flex items-start gap-2 ${className}`}>
            <div className="w-10 h-10 rounded-full border flex items-center justify-center">👤</div>
            <div className="flex-1">
                <textarea
                placeholder={placeholder}
                className="w-full h-20 bg-gray-200 rounded p-2 resize-none"
                value={valor}
                onChange={(e) => onCambiar(e.target.value)}
                />
                <div className="flex justify-end mt-2 gap-2">
                {onCancelar && (
                    <button
                    className="px-3 py-1 bg-black text-white rounded text-sm"
                    onClick={onCancelar}
                    >
                        Cancelar
                    </button>
                )}
                {onEnviar && (
                    <button
                    className="px-3 py-1 bg-black text-white rounded text-sm"
                    onClick={onEnviar}
                    >
                        Comentar
                    </button>
                )}
                </div>
            </div>
        </div>
    );
};

export default CajaComentario;
