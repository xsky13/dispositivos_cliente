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
        <div className="navbar bg-base-100 shadow-sm justify-around">
            <div className="">
                <Link to="/" className="font-bold text-xl">TwinGrid</Link>
            </div>
            <div className="">
                <ul className="menu menu-horizontal px-1 flex items-center gap-x-5">
                    <li><Link to="/cuenta" className="font-medium">{user?.nombre}</Link></li>
                    <li><Link to="/notificaciones" className="font-medium">Notificaciones</Link></li>
                    <li>
                        <button onClick={logout} className="btn">Salir</button>
                    </li>
                </ul>
            </div>
        </div>
    )
}