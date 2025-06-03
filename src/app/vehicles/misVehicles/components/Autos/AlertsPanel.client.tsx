"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
}

interface SortableAlertCardProps {
    alert: AlertCard;
    getAlertValue: (type: AlertCard['type']) => number;
}

const SortableAlertCard = ({ alert, getAlertValue }: SortableAlertCardProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: alert.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 0,
        opacity: isDragging ? 0.7 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`${alert.bgColor} p-4 rounded-lg shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow`}
        >
            <Link href={alert.href} passHref legacyBehavior={false}>
                <div className="flex items-center justify-between w-full">
                    <div>
                        <h3 className={`text-lg font-semibold ${alert.textColor}`}>{alert.title}</h3>
                        <p className={`text-2xl font-bold ${alert.textColor.replace('-800', '-900')}`}>{getAlertValue(alert.type)}</p>
                        {alert.type === 'calificaciones' && getAlertValue(alert.type) === 0 && (
                            <p className={`text-sm ${alert.textColor.replace('-800', '-700')}`}>No hay reseñas nuevas</p>
                        )}
                    </div>
                    {alert.icon}
                </div>
            </Link>
        </div>
    );
};

const AlertsPanelClient = ({ alertas, initialAlertsOrder }: AlertsPanelProps) => {
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

    const [alertsOrder, setAlertsOrder] = useState<AlertCard[]>(initialAlertsOrderWithUpdatedHref);

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

    const getAlertValue = (type: AlertCard['type']) => {
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
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default AlertsPanelClient; 