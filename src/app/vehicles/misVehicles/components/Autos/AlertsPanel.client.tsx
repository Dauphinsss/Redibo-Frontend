"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
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
}

const SortableAlertCard = ({ alert, getAlertValue, calificacionVista, marcarCalificacionVista, alertas, router }: SortableAlertCardProps & { calificacionVista: boolean, marcarCalificacionVista: () => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: alert.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 0,
        opacity: isDragging ? 0.7 : 1,
    };

    
    const dndListeners = alert.type === 'calificaciones' ? {} : listeners;

    
    const cardBg = (alert.type === 'calificaciones' && calificacionVista && alertas.calificacionesPendientes === 0) ? 'bg-gray-200' : alert.bgColor;
    const cardText = (alert.type === 'calificaciones' && calificacionVista && alertas.calificacionesPendientes === 0) ? 'text-gray-600' : alert.textColor;

    console.log(`Card: ${alert.title}, Type: ${alert.type}, Vista: ${calificacionVista}, cardBg: ${cardBg}, cardText: ${cardText}`);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...dndListeners} 
            className={`${cardBg} p-4 rounded-lg shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow`}
            onClick={() => {
                if (alert.type === 'calificaciones') {
                    
                    console.log(`Clic en Calificaciones Pendientes. Pendientes: ${alertas.calificacionesPendientes}, Href: ${alert.href}`);
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
                } else {
                    
                    if (alert.href) {
                         router.push(alert.href); 
                    }
                }
            }}
        >
            <div className="flex items-center justify-between w-full">
                <div>
                    <h3 className={`text-lg font-semibold ${cardText}`}>{alert.title}</h3>
                    <p className={`text-2xl font-bold ${cardText}`}>{getAlertValue(alert.type)}</p>
                    {alert.type === 'calificaciones' && getAlertValue(alert.type) === 0 && (
                        <p className={`text-sm ${cardText}`}>No hay reseñas nuevas</p>
                    )}
                </div>
                {alert.type === 'calificaciones' && calificacionVista
                    ? (    // Icono de estrella gris 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.329 1.176l1.519 4.674c.3.921-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.539-1.118l1.519-4.674a1 1 0 00-.329-1.176l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" />
                        </svg>
                    )
                    : (    // Icono original si no es calificación 
                        <Link href={alert.href} passHref legacyBehavior={false} onClick={(e) => e.stopPropagation()}> {/* Enlaza el icono y detiene la propagación del clic */} 
                            {alert.icon}
                        </Link>
                    )
                }
            </div>
        </div>
    );
};

const AlertsPanelClient = ({ alertas, initialAlertsOrder, refreshAlerts }: AlertsPanelProps) => {
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

   
    const [notificado, setNotificado] = useState(false);

    const [calificacionVista, setCalificacionVista] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: () => undefined,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setAlertsOrder((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

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
    }, [initialAlertsOrder]);

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
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default AlertsPanelClient; 