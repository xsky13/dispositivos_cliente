import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLocation,
	useNavigate,
	useNavigation,
} from "react-router";
import {
	useQuery,
	useMutation,
	useQueryClient,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query'

import type { Route } from "./+types/root";
import "./app.css";
import type { User } from "./types/user";
import api from "./api";
import { AuthContext } from "./context/AuthContext";
import Login from "./components/Auth/Login";
import Header from "./components/Header";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast, Toaster } from "sonner";
import Loading from "./components/Loading";

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
];

export type Alert = {
	deviceId: number,
	message: string,
	timestamp: string,
	nivel: string,
	usuarios: number[],
	alertaId?: number
}

const queryClient = new QueryClient()

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" style={{ height: '100%' }} className="dark:bg-base-300!">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body style={{ height: '100%' }} className="dark:bg-base-300!">
				<QueryClientProvider client={queryClient}>
					<AppContent>{children}</AppContent>
					{/* <Toaster /> */}
					<ScrollRestoration />
					<Scripts />
				</QueryClientProvider>
			</body>
		</html>
	);
}


function AppContent({ children }: { children: React.ReactNode }) {
	const navigation = useNavigation();
	const navigate = useNavigate();
	const isNavigating = Boolean(navigation.location);
	const queryClient = useQueryClient()

	const location = useLocation();
	const userQuery = useQuery<User>({
		queryKey: ['user'],
		queryFn: async () => {
			const response = await api.get('/usuarios/authenticated');
			return response.data;
		},
		retry: 0
	});

	useEffect(() => {
		const token = localStorage.getItem('token');
		const socket = io('http://localhost:8000', {
			auth: { token }
		});

		socket.on('connect', () => {
			console.log('Connected to WebSocket');
		});

		socket.on('connect_error', (error) => {
			console.error('Connection error:', error.message);
		});

		socket.on('alert', (alert: Alert) => {
			toast.error(`Alerta nivel ${alert.nivel} en dispositivo ${alert.deviceId}`, {
				action: {
					label: 'Resolver',
					onClick: () => { navigate(`/alertas/${alert.alertaId}`) }
				}
			});
			queryClient.invalidateQueries({ queryKey: ['notificaciones_usuario'] })
		});

		return () => { socket.disconnect() };
	}, []);


	if (isNavigating) return <Loading />;
	if (userQuery.isLoading) return <Loading />;
	if (userQuery.isError && location.pathname !== '/registrarse') {
		return (
			<div className="h-screen w-full flex items-center justify-center">
				{/* {isNavigating && <div className="pt-40">loading...</div>} */}
				<div className="bg-base-200 border-base-300 rounded-box w-96 border py-4 px-4.5">
					<Login />
				</div>
			</div>
		)
	};

	return (
		<AuthContext value={userQuery.data}>
			<Header />
			<Toaster richColors />
			{children}
		</AuthContext>
	);
}


export default function App() {
	return <Outlet />;
}


export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
