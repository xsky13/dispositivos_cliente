import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { use, useEffect, useState, type FormEvent } from "react";

interface LoginCredentials {
    email: string;
    password: string;
}

interface LoginResponse { token: string };

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [pwd, setPwd] = useState<string>("");
    const [error, setError] = useState<string>("");

    const mutation = useMutation<LoginResponse, Error, LoginCredentials>({
        mutationFn: async (credentials: LoginCredentials) => {
            return await axios({
                method: "POST",
                url: "http://localhost:8000/auth/login",
                data: credentials,
            });
        },
        onSuccess: data => {
            localStorage.setItem('token', data.token);
            window.location.reload();
            setError("");
        },
        onError: err => {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || err.message);
            } else {
                setError(err.message);
            }
        }
    });


    const loginUser = (e: FormEvent) => {
        e.preventDefault();

        mutation.mutate({ email, password: pwd });
    }

    // const [error, setError] = useState("");

    return (
        <form onSubmit={loginUser}>
            <fieldset className="fieldset gap-y-4">
                <h1 className="text-3xl font-bold">Login</h1>
                <div>
                    <label className="label">Email</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="input mt-1" placeholder="Su correo electronica" />
                </div>

                <div>
                    <label className="label">Password</label>
                    <input value={pwd} onChange={e => setPwd(e.target.value)} type="password" className="input mt-1" placeholder="Su contrasena" />
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <button className="btn btn-neutral mt-2" disabled={mutation.isPending}>
                    {
                        mutation.isPending ?
                            <span className="loading loading-spinner loading-md"></span>
                            : 'Loading'
                    }
                </button>
            </fieldset>
        </form>
    );
}