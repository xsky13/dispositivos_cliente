import { useState } from "react";

export default function Search({ type }: { type: string }) {
    const opciones = [
        {
            name: "Nombre",
            id: "name"
        },
        {
            name: "Estado",
            id: "state"
        },
        {
            name: "Tipo",
            id: "type"
        },
    ];
    const [opcionDefault, setOpcionDefault] = useState(opciones[0]);

    const showOptions = () => {
        if (type == "dispositivos") {
            return (
                <div className="flex justify-end items-center pt-1.5 pb-3">
                    <span className="text-sm font-bold">Filtrar por:</span>
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="text-sm text-primary cursor-pointer m-1">{opcionDefault.name}</div>
                        <ul tabIndex={-1} className="text-sm dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                            {
                                opciones.map(opcion => (
                                    <li><a onClick={e => {
                                        setOpcionDefault(opcion)
                                    }}>{opcion.name}</a></li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            )
        }
    }
    return (
        <div>
            <div className="w-full flex gap-x-2 pt-3">
                <input type="text" placeholder="Buscar..." className="input" /><button className="btn btn-primary">Buscar</button>
            </div>
            {showOptions()}
        </div>
    );
}