import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import api from "~/api";
import type { Dispositivo } from "~/types/dispositivo";
import type { Notificacion } from "~/types/notificacion";
import Loading from "../Loading";
import type { Alerta } from "~/types/alerta";
import AlertaComponent from "./AlertaComponent";

export default function Resoluciones({ dispositivo }: { dispositivo: Dispositivo }) {
    const modalRef = useRef<HTMLDialogElement>(null);
    const [notificacionesDispositivo, setNotificacionesDispositivo] = useState<Notificacion[]>([]);
    const [alertas, setAlertas] = useState<Alerta[]>([]);
    const [loading, setLoading] = useState(true);
    const notificacionesQuery = useQuery<Notificacion[]>({
        queryKey: ['notificaciones_usuario'],
        queryFn: async () => {
            const response = await api.get("/notificaciones");
            return response.data;
        },
        retry: 3
    });

    useEffect(() => {
    if (!notificacionesQuery.data) return;

    const notificacionesFiltradas = notificacionesQuery.data.filter(n => n.dispositivoId === dispositivo.id);
    setNotificacionesDispositivo(notificacionesFiltradas);

    let mounted = true;
    setLoading(true);

    (async () => {
        try {
            if (notificacionesFiltradas.length > 0) {
                const uniqueIds = [...new Set(notificacionesFiltradas.map(n => n.alertaId))];
                const results = await Promise.all(
                    uniqueIds.map(async id => {
                        const res = await api.get("/alertas/" + id);
                        return res.data;
                    })
                );
                if (mounted) setAlertas(results);
            } else {
                if (mounted) setAlertas([]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            if (mounted) setLoading(false);
        }
    })();

    return () => {
        mounted = false;
    };
}, [dispositivo, notificacionesQuery.data]);

    useEffect(() => {
    if (!loading) {
        if (dispositivo.state === "alert" && alertas.length > 0) {
            modalRef.current?.showModal();
        } else {
            modalRef.current?.close();
        }
    }
}, [dispositivo, loading, alertas]);

    return (
        <>
            <dialog ref={modalRef} className="modal modal-start">
                <div className="modal-box w-3/6 h-screen overflow-y-auto p-0!">
                    {
                        loading ?
                            <Loading />
                            :
                            <>
                                <div className="flex items-center sticky top-0 z-10 bg-base-100 px-5 py-4 w-full">
                                    <h3 className="font-bold text-lg flex-1">Alertas en dispositivo</h3>
                                        <form method="dialog">
                                            {/* if there is a button in form, it will close the modal */}
                                            <button className="btn">Cerrar</button>
                                        </form>
                                </div>
                                <div className="p-4">
                                    {
                                    notificacionesDispositivo.map((notificacion, i) => {
                                        const alerta = alertas.find(a => a.id == notificacion.alertaId);
                                        return <AlertaComponent key={i} alerta={alerta!} notificacion={notificacion} dispositivo={dispositivo} />
                                    })
                                }
                                </div>
                            </>
                    }

                </div>
            </dialog>
        </>
    );
}