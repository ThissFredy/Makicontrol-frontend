"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { IoPerson } from "react-icons/io5";

import type { LoginCredentials } from "@/types/loginType";
import type { ErrorFieldType } from "@/types/errorType";
import { validateLogin } from "@/utilities/validateLogin";
import { loginService } from "@/services/loginService";

const LoginForm = () => {
    const router = useRouter();
    const [errors, setErrors] = useState<ErrorFieldType[]>([]);
    const [apiError, setApiError] = useState<string | null>(null); // Estado para errores de API
    const [isLoading, setIsLoading] = useState(false); // Estado de carga
    const [loginData, setLoginData] = useState<LoginCredentials>({
        username: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const data = { ...loginData, [name]: value };
        setLoginData(data);
        const validationErrors = validateLogin(data);
        setErrors(validationErrors);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (errors.length > 0) {
            return;
        }

        setIsLoading(true);
        setApiError(null);
        console.log("Datos de inicio de sesión:", loginData);
        const response = await loginService(loginData);

        setIsLoading(false);

        if (response.status) {
            router.push("/dashboard");
        } else {
            setApiError(response.message || "Error al iniciar sesión");
        }
    };

    return (
        <div className="bg-slate-100 flex items-center justify-center min-h-[calc(100vh-50px)]">
            <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg max-w-md w-full">
                {/* Encabezado */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">
                        Iniciar Sesión
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Ingresa tus credenciales para acceder a tu cuenta
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                    {/* Mensaje de error de la API */}
                    {apiError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                            {apiError}
                        </div>
                    )}

                    {/* Campo de Correo Electrónico */}
                    <div className="mb-5 relative">
                        <label
                            htmlFor="username"
                            className="block mb-2 text-sm font-medium text-slate-600"
                        >
                            Usuario
                        </label>
                        <IoPerson
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 mt-[14px]"
                            size={20}
                        />
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={loginData.username}
                            placeholder="Nombre de usuario"
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onChange={handleInputChange}
                        />
                        <span className="text-red-500 text-sm mt-1">
                            {
                                errors.find(
                                    (error) => error.field.name === "username"
                                )?.field.value
                            }
                        </span>
                    </div>

                    {/* Password */}
                    <div className="mb-4 relative">
                        <label
                            htmlFor="password"
                            className="block mb-2 text-sm font-medium text-slate-600"
                        >
                            Contraseña
                        </label>
                        <FiLock
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 mt-[14px]"
                            size={20}
                        />
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={loginData.password}
                            onChange={handleInputChange}
                            placeholder="****************"
                            className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 mt-[14px]"
                        >
                            {showPassword ? (
                                <FiEyeOff size={20} />
                            ) : (
                                <FiEye size={20} />
                            )}
                        </button>
                        <span className="text-red-500 text-sm mt-1">
                            {
                                errors.find(
                                    (error) => error.field.name === "password"
                                )?.field.value
                            }
                        </span>
                    </div>

                    {/* Botón de Iniciar Sesión */}
                    <button
                        type="submit"
                        className={`w-full bg-[#253763] text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-300 ${
                            isLoading || errors.length > 0
                                ? "bg-gray-500 cursor-not-allowed opacity-50"
                                : "hover:bg-slate-700 focus:ring-slate-800 cursor-pointer"
                        }`}
                        disabled={isLoading || errors.length > 0}
                    >
                        {isLoading ? "Iniciando..." : "Iniciar Sesión"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
