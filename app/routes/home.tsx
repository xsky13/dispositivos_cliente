import Login from "~/components/Auth/Login";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	return (
		<div className="h-screen flex justify-center items-center w-full">
			<div className="bg-base-200 border-base-300 rounded-box w-96 border py-4 px-4.5">
				<Login />
			</div>
		</div>
	);
}
