import { useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "~/context/AuthContext";

export default function Header() {
    const user = useContext(AuthContext);

    const logout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    }
    return (
        <div className="bg-base-100 shadow">
            <div className="navbar container-width block m-auto">
                <div className="flex items-center">
                    <div className="flex-1">
                        <Link to="/" className="font-bold text-xl">TwinGrid</Link>
                    </div>
                    <div className="flex-none">
                        <ul className="menu menu-horizontal px-1 flex items-center gap-x-5">
                            <li><Link to="/cuenta" className="font-medium">{user?.nombre}</Link></li>
                            <li><Link to="/notificaciones" className="font-medium">Notificaciones</Link></li>
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