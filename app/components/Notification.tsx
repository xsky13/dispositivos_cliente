import { useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { Link } from "react-router";
import api from "~/api";
import type { Notificacion } from "~/types/notificacion";

export default function Notification({
    notificacion,
    updateNotificationArray
}: {
    notificacion: Notificacion,
    updateNotificationArray: (id: number) => void
}) {
    const setVistoMutation = useMutation({
        mutationKey: ['set_visto_notificacion'],
        mutationFn: async () => {
            const response = await api.post("/notificaciones/visto/" + notificacion.id)
            return response.data;
        },
        onSuccess: () => {
            updateNotificationArray(notificacion.id);
        }
    });

    const setVisto = () => setVistoMutation.mutate();

    return (
        <div className="card card-sm z-1 border-base-200 dark:border-base-100 border first:mt-0 last:mb-0 my-2">
            <div className={"card-body " + (notificacion.visto ? "flex flex-col sm:flex-row gap-2" : "")}>
                <p className="font-medium">Hubo un error en el dispositivo {notificacion.dispositivoId}</p>
                {
                    notificacion.visto ?
                        <Link to={"/dispositivo/" + notificacion.dispositivoId} className="w- btn-xs btn btn-error flex-none">Visitar</Link>
                        :
                        <div className="flex items-center justify-between">
                            <div className="pill pill-info text-xs">Nuevo</div>
                            <div className="flex gap-x-2">
                                <button className="btn-xs btn btn-soft" disabled={setVistoMutation.isPending} onClick={setVisto}>
                                    {
                                        setVistoMutation.isPending ?
                                            <span className="loading loading-spinner loading-xs"></span> :
                                            <Check size={15} />
                                    }

                                </button>
                                <Link to={"/dispositivo/" + notificacion.dispositivoId} className="btn-xs btn btn-error btn-">Visitar</Link>
                            </div>
                        </div>
                }
            </div>
        </div>
    );
}