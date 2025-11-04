import { useQuery } from "@tanstack/react-query";
import api from "~/api";
import type { Route } from "../+types/root";
import { useParams } from "react-router";
import Loading from "~/components/Loading";
import QueryErrorBlock from "~/components/QueryErrorBlock";
import type { Dispositivo } from "~/types/dispositivo";

// export async function loader({ params }: Route.LoaderArgs) {
//     const response = await api.get("/dispositivo/" + params.dispositivoId);
//     return response.data;
// }

export default function Dispositivo() {
    const { dispositivoId } = useParams();

    const dispositivoQuery = useQuery<Dispositivo>({
        queryKey: ['get_dispositivo'],
        queryFn: async () => {
            const response = await api.get("/dispositivos/" + dispositivoId);
            return response.data;
        },
        retry: 0
    });

    if (dispositivoQuery.isLoading) return <Loading />;
    if (dispositivoQuery.isError) return <QueryErrorBlock message={dispositivoQuery.error.message} />

    return (
        <div className="container">
            <h1>{dispositivoQuery.data?.name}</h1>
        </div>
    );
}