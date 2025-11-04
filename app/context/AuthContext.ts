import { createContext } from "react";
import type { User } from "~/types/user";


export const AuthContext = createContext<User | undefined | null>(null);