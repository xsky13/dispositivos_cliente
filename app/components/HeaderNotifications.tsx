import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Notificacion } from "~/types/notificacion";
import Notification from "./Notification";

export default function HeaderNotifications({ notificaciones }: { notificaciones: Notificacion[] }) {
    const [updNotificaciones, setUpdNotificaciones] = useState<Notificacion[]>(notificaciones);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const updateNotificationArray = (nId: number) => {
        setUpdNotificaciones(prev =>
            prev.map(n => n.id === nId ? { ...n, visto: true } : n)
        );
    };

    const unseenCount = updNotificaciones.filter(n => !n.visto).length;

    return (
        <div className="relative" ref={dropdownRef}>

            <button
                onClick={() => setOpen(o => !o)} className="cursor-pointer flex items-center gap-2">
                    <div className="rounded-full shadow-sm px-2 py-1 bg-primary text-white text-xs">
                {unseenCount}
            </div>
                Notificaciones
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-92 max-h-96 overflow-y-auto rounded-md 
                                   border border-gray-200 dark:border-none bg-white dark:bg-base-200 
                                   shadow-md z-50"
                    >
                        {updNotificaciones.length === 0 ? (
                            <div className="p-3 text-center text-sm text-gray-500">
                                Sin notificaciones
                            </div>
                        ) : (
                            updNotificaciones.map(notificacion => (
                                <Notification
                                    key={notificacion.id}
                                    notificacion={notificacion}
                                    updateNotificationArray={updateNotificationArray}
                                />
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
