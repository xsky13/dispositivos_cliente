import Login from "~/components/Auth/Login";
import type { Route } from "./+types/home";
import { useContext, useEffect, type JSX, type ReactNode } from "react";
import { AuthContext } from "~/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import api from "~/api";
import { Link } from "react-router";
import Search from "~/components/Search";
import type { Dispositivo } from "~/types/dispositivo";
import { displayState } from "~/utils";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "TwinGrid" },
		{ name: "description", content: "TwinGrid: gestion de dispositivos IoT" },
	];
}



export default function Home() {
	const dispositivosQuery = useQuery<Dispositivo[]>({
		queryKey: ['get_dispositivos'],
		queryFn: async () => {
			const response = await api.get("/dispositivos");
			return response.data;
		}
	});


	if (dispositivosQuery.isLoading) {
		return <div className="text-center py-20">
			<span className="loading loading-ring loading-xl"></span>
		</div>
	}

	if (dispositivosQuery.isError) {
		return <div>
			<div role="alert" className="alert alert-error">
				<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<span>{dispositivosQuery.error.message}</span>
			</div>
		</div>
	}
	return (
		<div className="container">
			<div className="flex flex-col gap-y-3">
				<div role="tablist" className="tabs tabs-border">
					<a role="tab" className="tab tab-active">Dispositivos</a>
					<Link to="/sucursales" role="tab" className="tab">Sucursales</Link>
				</div>
				<Search type="dispositivos" />
				{
					dispositivosQuery.data?.map((dispositivo: Dispositivo, i: number) => (
						<div key={i} className="bg-base-100 border-base-300 rounded-sm w-full block border py-4 px-4.5">
							<div className="flex justify-between">
								<span className="font-bold">{dispositivo.name}</span>
							</div>
							<div className="pb-4">
								<p className="text-sm! my-2 text-gray-600 dark:text-gray-500">{dispositivo.descripcion}</p>
								<div className="mt-1 flex items-center gap-3">
									{displayState(dispositivo.state)}
									<div className="pill pill-info">
										{dispositivo.type}
									</div>
								</div>
							</div>
							<div className="w-full flex gap-x-3">
								<Link to={"/dispositivo/" + dispositivo.id} className="btn btn-sm btn-soft btn-primary flex-1">Vistar</Link>
								<button className="btn btn-sm btn-soft flex-1">Configurar</button>
							</div>
						</div>
					))
				}
			</div>
		</div>
	);
}
