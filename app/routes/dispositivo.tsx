import { useQuery } from "@tanstack/react-query";
import api from "~/api";
import type { Route } from "../+types/root";
import { useParams } from "react-router";
import Loading from "~/components/Loading";
import QueryErrorBlock from "~/components/QueryErrorBlock";
import type { Dispositivo } from "~/types/dispositivo";
import { displayState } from "~/utils";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

const options = {
    responsive: true,
    // maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        // title: {
        //     display: true,
        //     text: 'Uso de energia'
        // }
    }
};


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

    const labels: string[] = dispositivoQuery.data?.schemaJson.usage.dates.map((d: any) => d.date);
    const values: number[] = dispositivoQuery.data?.schemaJson.usage.dates.map((d: any) => d.value);

    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: 'Dataset 2',
                data: values,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    const schemaJson = structuredClone(dispositivoQuery.data?.schemaJson || {});
    delete schemaJson.usage;


    return (
        <div className="container">
            <div className="flex justify-between">
                <div>
                    <h1>{dispositivoQuery.data?.name}</h1>
                    <div className="my-1 text-gray-600 text-sm">{dispositivoQuery.data?.descripcion}  • Sucursal • {dispositivoQuery.data?.type}</div>
                </div>
                {displayState(dispositivoQuery.data?.state)}
            </div>
            {
                dispositivoQuery.data?.schemaJson.usage &&
                <div className="py-10">
                    <div className="flex gap-4 items-start flex-wrap md:flex-nowrap">
                        <div className="w-full md:w-4/6">
                            <p className="text-center text-gray-600 font-bold text-sm">Uso de energia</p>
                            <Line
                                options={options}
                                data={data}
                            // height={200}
                            />
                        </div>


                        <div className="w-full md:w-2/6 ">
                            <p className="text-center text-gray-600 font-bold text-sm mb-2">Atributos internos</p>
                            <div className="mockup-code overflow-auto">
                                <pre className="text-sm whitespace-pre-wrap">
                                    {JSON.stringify(schemaJson, null, 2)?.replace(/^{|}$/g, '')}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div >
    );
}