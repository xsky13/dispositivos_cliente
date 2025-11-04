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
                <div className="flex gap-x-3 items-center pt-1.5 pb-3">
                    <span className="text-sm font-bold">Filtrar por:</span>
                    <div className="flex gap-x-4">
                        {
                        opciones.map((opcion, i) => (
                            <div>
                                <input type="radio" name="radio-opcion" id={"radio-" + i} className="radio radio-xs" defaultChecked={opcionDefault.id == opcion.id} />
                                <label className="text-sm ml-1" htmlFor={"radio-" + i}>{opcion.name}</label>
                            </div>
                        ))
                    }
                    </div>
                </div>
            )
        }
    }
    return (
        <div>
            <div className="w-full flex gap-x-2 pt-3">
                <input type="text" placeholder="Buscar..." className="input" /><button className="btn btn-neutral">Buscar</button>
            </div>
            {showOptions()}
        </div>
    );
}