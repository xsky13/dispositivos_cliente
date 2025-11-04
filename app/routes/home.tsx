import Login from "~/components/Auth/Login";
import type { Route } from "./+types/home";
import { useContext, useEffect } from "react";
import { AuthContext } from "~/context/AuthContext";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	const user = useContext(AuthContext);

	useEffect(() => {
		console.log(user);
		
	}, [])
	return (
		<div>
			<h1>{user?.nombre}</h1>
		</div>
	);
}
