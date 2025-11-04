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
import { useEffect, useState } from "react";

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




export default function Dispositivo() {
    const { dispositivoId } = useParams();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const media = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDark(media.matches);

        const listener = (e: MediaQueryListEvent) => setIsDark(e.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, []);

    const gridColor = isDark ? '#1D232A' : '#EEEEEE';
    const textColor = '#4A5565';

    const options = {
        responsive: true,
        // maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: gridColor
                },
                ticks: {
                    color: textColor,
                },
            },
            x: {
                grid: {
                    color: gridColor
                },
                ticks: {
                    color: textColor,
                },
            }
        },
    };

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
            {
                dispositivoQuery.data?.schemaJson.usage &&
                <div className="py-10">
                    <div className="flex gap-10 items-start flex-wrap md:flex-nowrap">
                        <div className="w-full md:w-2/6">
                            <p className=" text-gray-600 font-bold text-sm mb-2">Informacion general</p>
                            <div className="border border-dashed border-base-300 dark:border-base-100 rounded-md py-4 px-5">
                                <h1>{dispositivoQuery.data?.name}</h1>
                                <div className="text-gray-600 text-sm">
                                    <div className="my-1"></div>
                                    <div className="my-2 flex items-center gap-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                        </svg>


                                        <span>{dispositivoQuery.data?.descripcion}</span>
                                    </div>
                                    <div className="my-2 flex items-center gap-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                                        </svg>

                                        <span>Sucursal: {dispositivoQuery.data?.sucursal}</span>
                                    </div>

                                    <div className="my-2 flex items-center gap-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
                                        </svg>
                                        <span>Tipo: <span className="font-bold">{dispositivoQuery.data?.type}</span></span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <p className=" text-gray-600 font-bold text-sm mb-2">Atributos internos</p>
                                <div className="mockup-code dark:bg-base-100  overflow-auto">
                                    <pre className="text-sm whitespace-pre-wrap">
                                        {JSON.stringify(schemaJson, null, 2)?.replace(/^{|}$/g, '').replace("\n", "")}
                                    </pre>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-4/6">
                            <p className=" text-gray-600 font-bold text-sm">Uso de energia</p>
                            <Line
                                options={options}
                                data={data}
                            />
                        </div>
                    </div>
                </div>
            }
        </div >
    );
}