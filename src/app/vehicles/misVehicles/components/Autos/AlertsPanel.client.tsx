"use client";

import { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, horizontalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { API_URL } from "@/utils/bakend";
import { useRouter } from 'next/navigation';

interface AlertCard {
    id: string;
    type: 'reservas' | 'mantenimientos' | 'inactivos' | 'calificaciones';
    title: string;
    bgColor: string;
    textColor: string;
    icon: JSX.Element;
    href: string;
}

interface AlertsPanelProps {
    alertas: {
        proximasReservas: number;
        mantenimientos: number;
        vehiculosInactivos: number;
        calificacionesPendientes: number;
    };
    initialAlertsOrder: AlertCard[];
    refreshAlerts: () => void;
    inactiveCarsList: InactiveCarListItem[];
    pendingMaintenanceCarsList: Car[];
    mostrarCartilla: null | 'inactivos' | 'mantenimientos';
    setMostrarCartilla: (tipo: null | 'inactivos' | 'mantenimientos') => void;
}

interface InactiveCarListItem {
    id: number;
    marca: string;
    modelo: string;
    placa?: string;
    año?: number;
    Reserva?: Array<{ fecha_fin: string }>;
}

interface Car {
    id: number;
    marca: string;
    modelo: string;
    placa: string;
    num_mantenimientos: number;
}

interface SortableAlertCardProps {
    alert: AlertCard;
    getAlertValue: (type: AlertCard['type']) => number;
    alertas: {
        proximasReservas: number;
        mantenimientos: number;
        vehiculosInactivos: number;
        calificacionesPendientes: number;
    };
    router: ReturnType<typeof useRouter>;
    mostrarCartilla: null | 'inactivos' | 'mantenimientos';
    setMostrarCartilla: (tipo: null | 'inactivos' | 'mantenimientos') => void;
}

const SortableAlertCard = ({ 
    alert, 
    getAlertValue, 
    calificacionVista, 
    marcarCalificacionVista, 
    alertas, 
    router,
    mostrarCartilla,
    setMostrarCartilla 
}: SortableAlertCardProps & { 
    calificacionVista: boolean, 
    marcarCalificacionVista: () => void 
}) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
        id: alert.id,
        disabled: false 
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 0,
        opacity: isDragging ? 0.7 : 1,
        touchAction: 'none',
        cursor: isDragging ? 'grabbing' : 'grab' 
    };

    // Separar los listeners de drag and drop de los eventos de clic
    const dragListeners = {
        ...listeners,
        onClick: (e: React.MouseEvent) => {
            // Solo manejar el clic si no estamos arrastrando
            if (!isDragging) {
                handleClick(e);
            }
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevenir la propagación del evento
        console.log('Click en tarjeta:', alert.id, 'isDragging:', isDragging);
        
        if (alert.id === 'proximasReservas') {
            router.push('/calificaciones/calificacionesAlRenter/ActividadVehicles');
        } else if (alert.id === 'vehiculosInactivos') {
            setMostrarCartilla(mostrarCartilla === 'inactivos' ? null : 'inactivos');
        } else if (alert.id === 'mantenimientos') {
            setMostrarCartilla(mostrarCartilla === 'mantenimientos' ? null : 'mantenimientos');
        } else if (alert.type === 'calificaciones') {
            if (alertas.calificacionesPendientes > 0) {
                marcarCalificacionVista();
                if (alert.href) {
                    router.push(alert.href);
                }
            } else if (calificacionVista) {
                console.log("No hay calificaciones pendientes nuevas.");
            } else {
                marcarCalificacionVista();
            }
        } else if (alert.href) {
            router.push(alert.href);
        }
    };

    const getCardStyles = () => {
        switch (alert.id) {
            case 'proximasReservas':
                return 'bg-blue-100 text-blue-900';
            case 'vehiculosInactivos':
                return 'bg-red-100 text-red-900';
            case 'mantenimientos':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return alert.type === 'calificaciones' && calificacionVista && alertas.calificacionesPendientes === 0 
                    ? 'bg-gray-200 text-gray-600' 
                    : `${alert.bgColor} ${alert.textColor}`;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...dragListeners}
            className={`${getCardStyles()} p-4 rounded-lg shadow-sm flex items-center justify-between hover:shadow-md transition-shadow select-none`}
        >
            <div className="flex items-center justify-between w-full">
                <div>
                    <h3 className={`text-lg font-semibold`}>{alert.title}</h3>
                    <p className={`text-2xl font-bold`}>{getAlertValue(alert.type)}</p>
                    {alert.type === 'calificaciones' && getAlertValue(alert.type) === 0 && (
                        <p className={`text-sm`}>No hay reseñas nuevas</p>
                    )}
                </div>
                {alert.type === 'calificaciones' && calificacionVista ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.329 1.176l1.519 4.674c.3.921-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.539-1.118l1.519-4.674a1 1 0 00-.329-1.176l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" />
                    </svg>
                ) : (
                    <div onClick={(e) => e.stopPropagation()}>
                        {alert.icon}
                    </div>
                )}
            </div>
        </div>
    );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Esta función se usa en el componente padre
function tiempoInactivo(fechaISO?: string) {
    if (!fechaISO) return "Nunca ha tenido reservas";
    const fecha = new Date(fechaISO);
    const ahora = new Date();
    const diffMs = ahora.getTime() - fecha.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDias === 0) return "Inactivo desde hoy";
    if (diffDias === 1) return "Inactivo desde ayer";
    return `Inactivo desde hace ${diffDias} días`;
}

const AlertsPanelClient = ({ alertas, initialAlertsOrder, mostrarCartilla, setMostrarCartilla }: AlertsPanelProps) => {
    const initialAlertsOrderWithUpdatedHref: AlertCard[] = initialAlertsOrder.map(alert => {
        if (alert.id === 'calificacionesPendientes') {
            return {
                ...alert,
                href: '/calificaciones/calificacionesAlRenter',
            };
        } else if (alert.id === 'proximasReservas') {
            return {
                ...alert,
                href: '/calificaciones/calificacionesAlRenter/ActividadVehicles',
            };
        } else if (alert.id === 'vehiculosInactivos') {
            return {
                ...alert,
                href: '#inactive-vehicles-list',
            };
        } else if (alert.id === 'mantenimientos') {
            return {
                ...alert,
                href: '#pending-maintenance-list',
            };
        }
        return alert;
    });

    const router = useRouter();

    const [alertsOrder, setAlertsOrder] = useState<AlertCard[]>(initialAlertsOrderWithUpdatedHref);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Esta variable se usa para el estado de notificaciones
    const [notificado, setNotificado] = useState(false);

    const [calificacionVista, setCalificacionVista] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Distancia mínima para iniciar el arrastre
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        console.log('Drag end:', { activeId: active.id, overId: over?.id });

        if (over && active.id !== over.id) {
            setAlertsOrder((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                console.log('Reordenando:', { oldIndex, newIndex });

                const newOrder = arrayMove(items, oldIndex, newIndex);

                try {
                    localStorage.setItem('alertsOrder', JSON.stringify(newOrder.map(item => item.id)));
                } catch (e) {
                    console.error("Error saving alerts order to localStorage", e);
                }

                return newOrder;
            });
        }
    }

    useEffect(() => {
        const savedOrder = localStorage.getItem('alertsOrder');
        if (savedOrder) {
            try {
                const orderedIds: string[] = JSON.parse(savedOrder);
                const orderedCards = orderedIds
                    .map(id => initialAlertsOrderWithUpdatedHref.find(card => card.id === id))
                    .filter(card => card !== undefined) as AlertCard[];

                const existingIds = new Set(orderedCards.map(card => card.id));
                const finalOrder = [...orderedCards, ...initialAlertsOrderWithUpdatedHref.filter(card => !existingIds.has(card.id))];

                if (JSON.stringify(finalOrder.map(item => item.id)) !== JSON.stringify(alertsOrder.map(item => item.id))) {
                    setAlertsOrder(finalOrder);
                }
            } catch (e) {
                console.error("Error loading saved alerts order", e);
                setAlertsOrder(initialAlertsOrderWithUpdatedHref);
            }
        } else {
            setAlertsOrder(initialAlertsOrderWithUpdatedHref);
        }
    }, [initialAlertsOrder, alertsOrder, initialAlertsOrderWithUpdatedHref]);

    useEffect(() => {
        const yaNotificado = localStorage.getItem('mantenimientoNotificado');

        
        if (alertas.mantenimientos <= 0 || yaNotificado) {
            return;
        }

        const sendNotificationWithRetry = async (hostId: number) => {
            console.log(`Intentando enviar notificación de mantenimientos (Intento ${hostId} de 4)...`);
            try {
                const response = await fetch(`${API_URL}/api/mantenimiento/notificar-mantenimientos/${hostId}`, { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        console.log('Notificación enviada con éxito.');
                        setNotificado(true);
                        localStorage.setItem('mantenimientoNotificado', 'true');
                        
                    } else {
                        console.error(`Error al enviar notificación (Intento ${hostId}):`, data.error);
                        if (hostId < 4) {
                            console.log(`Reintentando en 5 segundos...`);
                            setTimeout(() => sendNotificationWithRetry(hostId + 1), 5000); // Incrementar intento
                        } else {
                            
                            alert("Hubo un problema al enviar la notificación por email después de varios intentos.");
                        }
                    }
                } else {
                    const errorText = await response.text();
                    console.error(`Error HTTP ${response.status} al enviar notificación (Intento ${hostId}):`, errorText);
                    if (hostId < 4) { 
                        console.log(`Reintentando en 5 segundos...`);
                        setTimeout(() => sendNotificationWithRetry(hostId + 1), 5000); 
                    } else {
                        
                        alert("Hubo un problema al enviar la notificación por email después de varios intentos.");
                    }
                }
            } catch (err) {
                console.error(`Error en el fetch al enviar notificación (Intento ${hostId}):`, err);
                if (hostId < 4) { 
                    console.log(`Reintentando en 5 segundos...`);
                    setTimeout(() => sendNotificationWithRetry(hostId + 1), 5000); 
                } else {
                    
                    alert("Hubo un problema al enviar la notificación por email después de varios intentos.");
                }
            }
        };

        
        sendNotificationWithRetry(1);

    }, [alertas.mantenimientos]); 

    useEffect(() => {
        setCalificacionVista(localStorage.getItem('calificacionVista') === 'true');
    }, []);

    useEffect(() => {
        
        const handleFocus = () => {
            setCalificacionVista(localStorage.getItem('calificacionVista') === 'true');
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const marcarCalificacionVista = () => {
        setCalificacionVista(true);
        localStorage.setItem('calificacionVista', 'true');
    };

    const getAlertValue = (type: AlertCard['type']) => {
        
        if (type === 'calificaciones' && calificacionVista && alertas.calificacionesPendientes === 0) return 0; 

        switch (type) {
          case 'reservas':
            return alertas.proximasReservas;
          case 'mantenimientos':
            return alertas.mantenimientos;
          case 'inactivos':
            return alertas.vehiculosInactivos;
          case 'calificaciones':
            
            return alertas.calificacionesPendientes;
          default:
            return 0;
        }
     };

    const items = alertsOrder.map(alert => alert.id);

    return (
        <>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items} strategy={horizontalListSortingStrategy}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {alertsOrder.map((alert) => (
                        <SortableAlertCard
                            key={alert.id}
                            alert={alert}
                            getAlertValue={getAlertValue}
                            calificacionVista={calificacionVista}
                            marcarCalificacionVista={marcarCalificacionVista}
                            alertas={alertas}
                            router={router}
                            mostrarCartilla={mostrarCartilla}
                            setMostrarCartilla={setMostrarCartilla}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
        </>
    );
};

export default AlertsPanelClient; 