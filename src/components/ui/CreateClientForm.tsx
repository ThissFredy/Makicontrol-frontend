import React from "react";
import type { CustomerCreateType, CustomerType } from "@/types/customerType";
import { validateCreate } from "@/utilities/validateCustomer";
import type { ErrorFieldType } from "@/types/errorType";
import { createCustomer } from "@/services/customerService";

interface CreateClientFormProps {
    onClose: () => void;
    onSuccess: (message: string, data: CustomerType) => void;
}

export const CreateClientForm = ({
    onClose,
    onSuccess,
}: CreateClientFormProps) => {
    const [dataForm, setData] = React.useState<CustomerCreateType>({
        nombre: "",
        nit: 0,
        direccion: "",
        telefono: "",
        correo: "",
    });
    const [errors, setErrors] = React.useState<ErrorFieldType[]>([]);

    const [isLoading, setIsLoading] = React.useState(false);
    const [apiError, setApiError] = React.useState<string | null>(null);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === "nit" ? parseFloat(value) || 0 : value;
        const data = { ...dataForm, [name]: parsedValue };
        setData(data);

        const validationErrors = validateCreate(data);
        setErrors(validationErrors);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validateCreate(dataForm);
        setErrors(validationErrors);

        if (validationErrors.length > 0) {
            return;
        }

        setIsLoading(true);
        setApiError(null);
        const response = await createCustomer(dataForm);

        setIsLoading(false);

        console.log("Respuesta del servicio:", response);

        if (response.status && response.message) {
            onSuccess(response.message, dataForm);
            onClose();
        } else {
            setApiError(response.message || "Error al crear cliente");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                    Crear Nuevo Cliente
                </h2>
                <p className="mt-1 text-slate-500">
                    Completa la información para crear un nuevo cliente.
                </p>
            </div>

            <div className="space-y-4">
                {apiError && (
                    <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
                        <p>{apiError}</p>
                    </div>
                )}
                <div>
                    <label
                        htmlFor="nit"
                        className="block text-sm font-medium text-slate-600 mb-1"
                    >
                        NIT
                    </label>
                    <input
                        type="number"
                        id="nit"
                        name="nit"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-red-500 text-sm">
                        {
                            errors.find((error) => error.field.name === "nit")
                                ?.field.value
                        }
                    </span>
                </div>
                <div>
                    <label
                        htmlFor="nombre"
                        className="block text-sm font-medium text-slate-600 mb-1"
                    >
                        Nombre completo
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-red-500 text-sm">
                        {
                            errors.find(
                                (error) => error.field.name === "nombre"
                            )?.field.value
                        }
                    </span>
                </div>
                <div>
                    <label
                        htmlFor="correo"
                        className="block text-sm font-medium text-slate-600 mb-1"
                    >
                        Correo electrónico
                    </label>
                    <input
                        type="email"
                        id="correo"
                        name="correo"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-red-500 text-sm">
                        {
                            errors.find(
                                (error) => error.field.name === "correo"
                            )?.field.value
                        }
                    </span>
                </div>
                <div>
                    <label
                        htmlFor="direccion"
                        className="block text-sm font-medium text-slate-600 mb-1"
                    >
                        Dirección
                    </label>
                    <input
                        type="text"
                        id="direccion"
                        name="direccion"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-red-500 text-sm">
                        {
                            errors.find(
                                (error) => error.field.name === "direccion"
                            )?.field.value
                        }
                    </span>
                </div>
                <div>
                    <label
                        htmlFor="telefono"
                        className="block text-sm font-medium text-slate-600 mb-1"
                    >
                        Teléfono
                    </label>
                    <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-red-500 text-sm">
                        {
                            errors.find(
                                (error) => error.field.name === "telefono"
                            )?.field.value
                        }
                    </span>
                </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
                <button
                    type="button"
                    onClick={onClose}
                    className={`px-4 py-2.5 font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200
                            ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 font-semibold 
                        text-white bg-slate-800 rounded-lg shadow-md hover:bg-slate-700 focus:outline-none 
                        focus:ring-2 focus:ring-offset-2 focus:ring-slate-800 transition-colors
                        ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                        ${
                            errors.length > 0
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }
                        `}
                >
                    Crear Cliente
                </button>
            </div>
        </form>
    );
};
