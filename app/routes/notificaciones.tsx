import { useQuery } from "@tanstack/react-query";
import { AlertTriangleIcon, Clock } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import api from "~/api";
import Loading from "~/components/Loading";
import QueryErrorBlock from "~/components/QueryErrorBlock";
import { AuthContext } from "~/context/AuthContext";
import type { Alerta } from "~/types/alerta";
import type { Dispositivo } from "~/types/dispositivo";
import type { Notificacion } from "~/types/notificacion";

export default function Notificaciones() {
    const user = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [alertas, setAlertas] = useState<Alerta[]>([]);

    const notificacionesQuery = useQuery<Notificacion[]>({
        queryKey: ['notificaciones_usuario'],
        queryFn: async () => {
            const response = await api.get("/notificaciones");
            return response.data;
        }
    });

    const dispositivosQuery = useQuery<Dispositivo[]>({
        queryKey: ['dispositivos_alerta'],
        queryFn: async () => {
            const response = await api.get("/dispositivos/state/alert");
            return response.data;
        }
    });

    useEffect(() => {
        if (!notificacionesQuery.data?.length) {
            setLoading(false);
            return;
        }

        let mounted = true;

        (async () => {
            try {
                const uniqueIds = [...new Set(notificacionesQuery.data.map(n => n.alertaId))];
                const results = await Promise.all(
                    uniqueIds.map(async id => {
                        const res = await api.get("/alertas/" + id);
                        return res.data;
                    })
                );
                if (mounted) {
                    setAlertas(results);
                    setLoading(false);
                }
            } catch (err) {
                if (mounted) setLoading(false);
                console.error(err);
            }
        })();

        return () => { mounted = false; };
    }, [notificacionesQuery.data]);


    if (loading) return <Loading />
    if (notificacionesQuery.isError) return <div className="container">
        <QueryErrorBlock message={notificacionesQuery.error?.message} />
    </div>

    const obtenerTiempoTranscurrido = (timestamp: string) => {
        const fecha = new Date(timestamp);
        const ahora = new Date();
        const diferenciaMs = ahora.getTime() - fecha.getTime();

        const difSegundos = Math.floor(diferenciaMs / 1000);
        const difMinutos = Math.floor(diferenciaMs / 60000);
        const difHoras = Math.floor(diferenciaMs / 3600000);
        const difDias = Math.floor(diferenciaMs / 86400000);
        const difSemanas = Math.floor(diferenciaMs / 604800000);
        const difMeses = Math.floor(diferenciaMs / 2592000000);
        const difAnios = Math.floor(diferenciaMs / 31536000000);

        if (difSegundos < 60) return 'Justo ahora';
        if (difMinutos < 60) return `Hace ${difMinutos} min`;
        if (difHoras < 24) return `Hace ${difHoras} ${difHoras === 1 ? 'hora' : 'horas'}`;
        if (difDias < 7) return `Hace ${difDias} ${difDias === 1 ? 'día' : 'días'}`;
        if (difSemanas < 4) return `Hace ${difSemanas} ${difSemanas === 1 ? 'semana' : 'semanas'}`;
        if (difMeses < 12) return `Hace ${difMeses} ${difMeses === 1 ? 'mes' : 'meses'}`;
        return `Hace ${difAnios} ${difAnios === 1 ? 'año' : 'años'}`;
    };

    console.log(notificacionesQuery.data);



    return (
        <div className="container">
            <h1>Notificaciones</h1>
            {
                notificacionesQuery.data?.length == 0 ?
                    <div>
                        no hay notificaciones
                    </div>
                    :
                    notificacionesQuery.data?.map((notificacion: Notificacion, i: number) => {
                        const dispositivo = dispositivosQuery.data?.find((d: Dispositivo) => d.id == notificacion.dispositivoId);
                        const alerta = alertas.find(a => a.id == notificacion.alertaId);
                        return <div key={i} className="flex items-start  space-x-4 my-6 bg-base-200 dark:bg-base-100 rounded-lg border-l-4 border-error px-4 py-3">
                            <div className="bg-error text-error-content rounded-lg p-2">
                                <AlertTriangleIcon size={30} />
                            </div>
                            <div className="w-full">
                                <span className="text-lg font-bold">{dispositivo?.name}</span>
                                <div className="text-sm text-gray-600">Sucursal: sucursal</div>
                                <p className="my-2">{notificacion.message}</p>
                                <div className="text-sm flex justify-between w-full items-center">
                                    <span className="pill pill-info">
                                        <Clock size={14} />
                                        {obtenerTiempoTranscurrido(alerta?.timestamp!)}
                                    </span>
                                    {notificacion.visto}
                                    <button className="btn btn-soft">Visitar</button>
                                </div>
                            </div>
                        </div>
                    })
            }
        </div>
    );
}