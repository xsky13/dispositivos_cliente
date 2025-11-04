import type { JSX } from "react"
import { Search, Filter, Download, RefreshCw, MoreVertical, Power, AlertCircle, CheckCircle, Clock } from 'lucide-react';


type StateType = 'active' | 'inactive' | 'alert';

const getStateConfig = (state?: string) => {
    const configs: Record<StateType, { color: string, icon: typeof CheckCircle, label: string }> = {
        active: { color: 'pill pill-success', icon: CheckCircle, label: 'Active' },
        inactive: { color: 'pill pill-disabled', icon: Power, label: 'Inactive' },
        alert: { color: 'pill pill-danger', icon: AlertCircle, label: 'Alerta' }
    };
    return configs[state as StateType] || configs.inactive;
};

export const displayState = (state?: string): JSX.Element => {
    const stateConfig = getStateConfig(state);
    const StateIcon = stateConfig.icon;
    return <div className={` ${stateConfig.color}`}>
        <StateIcon size={14} />
        {stateConfig.label}
    </div>
}

export const displayTextState = (state?: string): JSX.Element => {
    return state == "alert" ? <span className="text-red-700 " > {state.toUpperCase()} </span> : <span>{state}</span>
}