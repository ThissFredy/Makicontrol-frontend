import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import { UserToken } from "@/types/userType";

// Interfaz para el estado
interface AuthState {
    user: UserToken | null;
    token: string | null;
    isAuthenticated: boolean;
    setToken: (token: string) => void;
    logout: () => void;
}

// Crea el store
export const useAuthStore = create(
    persist<AuthState>(
        (set) => ({
            // Estado inicial
            user: null,
            token: null,
            isAuthenticated: false,

            // Acciones para modificar el estado
            setToken: (token) => {
                const decodedUser: UserToken = jwtDecode(token);
                set({
                    user: decodedUser,
                    token: token,
                    isAuthenticated: true,
                });
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },
        }),
        {
            name: "auth-storage", // nombre de la clave en el almacenamiento
        }
    )
);
