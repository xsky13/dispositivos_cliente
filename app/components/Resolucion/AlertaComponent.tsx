import { AlertTriangleIcon, Clock } from "lucide-react";
import type { Alerta } from "~/types/alerta";
import type { Dispositivo } from "~/types/dispositivo";
import type { Notificacion } from "~/types/notificacion";

export default function AlertaComponent({ alerta, notificacion, dispositivo }: { alerta: Alerta, notificacion: Notificacion, dispositivo: Dispositivo }) {
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

    return (
        <div className="flex items-start  space-x-4 my-6 bg-base-200 rounded-lg border-l-4 border-error px-4 py-3">
            <div className="w-full">
                <p className="my-2">{notificacion.message}</p>
                <div className="text-sm flex justify-between w-full items-center">
                    <span className="pill pill-info">
                        <Clock size={14} />
                        {obtenerTiempoTranscurrido(alerta?.timestamp!)}
                    </span>
                    {notificacion.visto}
                    <button className="btn btn-soft">Resolver</button>
                </div>
            </div>
        </div>
    );
}