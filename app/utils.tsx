import type { JSX } from "react"

export const displayState = (state?: string): JSX.Element => {
    return state == "alert" ? <span className="text-red-600 font-bold" > {state.toUpperCase()} </span> : <span>{state}</span >
}