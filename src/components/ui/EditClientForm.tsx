import React from "react";
import { useEffect } from "react";
import type { CustomerCreateType, CustomerType } from "@/types/customerType";
import { validateCreate } from "@/utilities/validateCustomer";
import type { ErrorFieldType } from "@/types/errorType";
import { updateCustomer } from "@/services/customerService";

interface EditClientFormProps {
    onClose: () => void;
    onSuccess: (message: string, data: CustomerType) => void;
    initialData: CustomerType;
}

export const EditClientForm = ({
    onClose,
    onSuccess,
    initialData,
}: EditClientFormProps) => {
    const [dataForm, setData] = React.useState<CustomerCreateType>({
        nombre: "",
        nit: 0,
        direccion: "",
        telefono: "",
        correo: "",
    });

    useEffect(() => {
        if (initialData) {
            setData({
                nombre: initialData.nombre,
                nit: initialData.nit,
                direccion: initialData.direccion,
                telefono: initialData.telefono,
                correo: initialData.correo,
            });
        }
    }, [initialData]);

    const [errors, setErrors] = React.useState<ErrorFieldType[]>([]);

    const [isLoading, setIsLoading] = React.useState(false);
    const [apiError, setApiError] = React.useState<string | null>(null);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const data = { 
            ...dataForm, 
            [name]: name === "nit" ? Number(value) : value 
        };
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
        const response = await updateCustomer(dataForm);

        setIsLoading(false);

        if (response.status) {
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
                    Editar Cliente
                </h2>
                <p className="mt-1 text-slate-500">
                    Completa la información para editar el cliente.
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
                        value={dataForm.nit}
                        disabled={true}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-slate-400 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo"
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
                        value={dataForm.nombre}
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
                        value={dataForm.correo}
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
                        value={dataForm.direccion}
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
                        value={dataForm.telefono}
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
                    className={`px-4 py-2.5 font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 hover:cursor-pointer
                            ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 font-semibold 
                        text-white bg-slate-800 rounded-lg shadow-md hover:bg-slate-700 hover:cursor-pointer focus:outline-none 
                        focus:ring-2 focus:ring-offset-2 focus:ring-slate-800 transition-colors
                        ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                        ${
                            errors.length > 0
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }
                        `}
                >
                    Editar Cliente
                </button>
            </div>
        </form>
    );
};
