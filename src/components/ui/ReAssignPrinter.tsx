import React from "react";
import { useEffect } from "react";
import type { printerType, printerCreateType } from "@/types/printerType";
import { validateEdit } from "@/utilities/validatePrinter";
import type { ErrorFieldType } from "@/types/errorType";
import {
    getCanonForPrintersService,
    reAssignPrintersService,
} from "@/services/printerService";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface ReAssignPrinterProps {
    onClose: () => void;

    onSuccess: (message: string) => void;
    initialData: printerType;
}

export const ReAssignPrinter = ({
    onClose,
    onSuccess,
    initialData,
}: ReAssignPrinterProps) => {
    const [dataForm, setDataForm] = useState<printerCreateType>({
        clienteNit: "",
        serial: "",
        modelo: "",
        grupo: "",
        fechaInicio: "",
    });

    useEffect(() => {
        if (initialData) {
            setDataForm({
                clienteNit: "",
                serial: initialData.serial,
                modelo: initialData.modelo,
                grupo: "",
                fechaInicio: "",
            } as printerCreateType);
        }
    }, [initialData]);

    const [errors, setErrors] = useState<ErrorFieldType[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [tiposOperacion, setTiposOperacion] = useState<string[]>([
        "ERROR AL OBTENER TIPOS DE OPERACION",
    ]);

    useEffect(() => {
        const fetchTiposOperacion = async () => {
            const response = await getCanonForPrintersService();
            if (response.status) {
                setTiposOperacion(response.data);
            } else {
                console.error(
                    "Error al obtener tipos de operación:",
                    response.message
                );
            }
        };

        fetchTiposOperacion();
    }, []);

    const handleChange = async (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        const data = {
            ...dataForm,
            [name]: value,
        } as printerCreateType;
        console.log("Datos cambiados:", data);
        setDataForm(data);

        const validationErrors = await validateEdit(data);
        setErrors(validationErrors);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("Datos del formulario:", dataForm);
        const validationErrors = await validateEdit(dataForm);
        setErrors(validationErrors);

        if (validationErrors.length > 0) {
            return;
        }

        setIsLoading(true);
        const response = await reAssignPrintersService(dataForm);
        setIsLoading(false);

        if (response.status) {
            onSuccess(response.message);
            onClose();
        } else {
            toast.error(response.message || "Error al crear cliente");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-h-[80vh] overflow-y-auto space-y-3"
        >
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                    Editar Impresora
                </h2>
                <p className="mt-1 text-slate-500">
                    Completa la información para editar los detalles de la
                    impresora.
                </p>
            </div>

            <div>
                <label
                    htmlFor="clienteNit"
                    className="block text-sm font-medium text-slate-600 mb-1"
                >
                    Cliente NIT (Nuevo)
                </label>
                <input
                    type="text"
                    id="clienteNit"
                    name="clienteNit"
                    value={dataForm.clienteNit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-red-500 text-sm">
                    {
                        errors.find(
                            (error) => error.field.name === "clienteNit"
                        )?.field.value
                    }
                </span>
            </div>

            <div>
                <label
                    htmlFor="serial"
                    className="block text-sm font-medium text-slate-600 mb-1"
                >
                    Serial
                </label>
                <input
                    type="text"
                    id="serial"
                    name="serial"
                    value={dataForm.serial}
                    disabled
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-500 "
                />
                <span className="text-red-500 text-sm">
                    {
                        errors.find((error) => error.field.name === "serial")
                            ?.field.value
                    }
                </span>
            </div>

            <div>
                <label
                    htmlFor="modelo"
                    className="block text-sm font-medium text-slate-600 mb-1"
                >
                    Modelo
                </label>
                <input
                    type="text"
                    id="modelo"
                    name="modelo"
                    value={dataForm.modelo}
                    disabled
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-500 "
                />
                <span className="text-red-500 text-sm">
                    {
                        errors.find((error) => error.field.name === "modelo")
                            ?.field.value
                    }
                </span>
            </div>

            <div>
                <label
                    htmlFor="grupo"
                    className="block text-sm font-medium text-slate-600 mb-1"
                >
                    Grupo de Impresora
                </label>
                <select
                    id="grupo"
                    name="grupo"
                    value={dataForm.grupo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="" disabled>
                        Selecciona un grupo
                    </option>
                    {tiposOperacion.map((tipo) => (
                        <option key={tipo} value={tipo}>
                            {tipo.replace(/_/g, " ")}
                        </option>
                    ))}
                </select>
                <span className="text-red-500 text-sm">
                    {
                        errors.find((error) => error.field.name === "grupo")
                            ?.field.value
                    }
                </span>
            </div>

            <div>
                <label
                    htmlFor="fechaInicio"
                    className="block text-sm font-medium text-slate-600 mb-1"
                >
                    Fecha de Inicio
                </label>
                <input
                    type="date"
                    id="fechaInicio"
                    name="fechaInicio"
                    value={dataForm.fechaInicio}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-red-500 text-sm">
                    {
                        errors.find(
                            (error) => error.field.name === "fechaInicio"
                        )?.field.value
                    }
                </span>
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
