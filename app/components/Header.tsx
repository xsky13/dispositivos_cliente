import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Link } from "react-router";
import api from "~/api";
import { AuthContext } from "~/context/AuthContext";
import type { Notificacion } from "~/types/notificacion";
import Loading from "./Loading";
import HeaderNotifications from "./HeaderNotifications";

export default function Header() {
    const user = useContext(AuthContext);

    const notificacionesQuery = useQuery<Notificacion[]>({
        queryKey: ['notificaciones_usuario'],
        queryFn: async () => {
            const response = await api.get("/notificaciones");
            return response.data;
        }
    });

    const logout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    }
    return (
        <div className="bg-base-100 shadow fixed w-full z-50">
            <div className="py-4 container-width block m-auto">
                <div className="flex items-center">
                    <div className="flex-1">
                        <Link to="/" className="font-bold text-xl">TwinGrid</Link>
                    </div>
                    <div className="flex-none">
                        <ul className="flex items-center text-sm px-1 gap-x-10">
                            <li><Link to="/cuenta" className="font-medium">{user?.nombre}</Link></li>

                            <li className="focus-within:bg-transparent active:bg-transparent focus-within:text-inherit active:text-inherit">
                                {
                                    notificacionesQuery.isLoading ? <span className="loading loading-ring loading-xl"></span>
                                        :
                                            <HeaderNotifications notificaciones={notificacionesQuery.data!} />
                                        
                                }
                            </li>
                            <li>
                                <button onClick={logout} className="btn">Salir</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}