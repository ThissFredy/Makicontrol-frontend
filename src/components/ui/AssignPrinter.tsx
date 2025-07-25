import React, { useEffect, useState } from "react";
import { validateCreate } from "@/utilities/validatePrinter";
import type { ErrorFieldType } from "@/types/errorType";
import { toast } from "react-hot-toast";
import {
    setPrintersByNitService,
    getCanonForPrintersService,
} from "@/services/printerService";
import type { printerCreateType } from "@/types/printerType";

interface CreateContractFormProps {
    onClose: () => void;
    onSuccess: (message: string, data: printerCreateType) => void;
    clienteNit: string;
}

export const AssignPrinter = ({
    onClose,
    onSuccess,
    clienteNit,
}: CreateContractFormProps) => {
    const [dataForm, setData] = useState<printerCreateType>({
        clienteNit: clienteNit,
        serial: "",
        modelo: "",
        grupo: "",
        fechaInicio: "",
    });

    const [tipoContratos, setTipoContratos] = useState<string[]>([""]);

    useEffect(() => {
        const fetchTiposContratos = async () => {
            const response = await getCanonForPrintersService();
            if (response.status) {
                setTipoContratos(response.data);
            } else {
                console.error(
                    "Error al obtener tipos de contrato:",
                    response.message
                );
            }
        };

        fetchTiposContratos();
    }, []);

    const [errors, setErrors] = useState<ErrorFieldType[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = async (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        const parsedValue = name === "nit" ? parseFloat(value) || "" : value;

        const data = { ...dataForm, [name]: parsedValue };
        setData(data);

        const validationErrors = await validateCreate(data);
        setErrors(validationErrors);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = await validateCreate(dataForm);
        setErrors(validationErrors);

        if (validationErrors.length > 0) {
            return;
        }

        setIsLoading(true);
        const response = await setPrintersByNitService(dataForm);

        setIsLoading(false);

        console.log("Respuesta del servicio:", response);

        if (response.status && response.message) {
            onSuccess(response.message, dataForm);
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
                    Asignar Impresora
                </h2>
                <p className="mt-1 text-slate-500">
                    Completa la información para asignar una impresora.
                </p>
            </div>

            <div className="space-y-4"></div>

            <div>
                <label
                    htmlFor="clienteNit"
                    className="block text-sm font-medium text-slate-600 mb-1"
                >
                    NIT
                </label>
                <input
                    type="number"
                    id="clienteNit"
                    name="clienteNit"
                    value={dataForm.clienteNit}
                    onChange={handleChange}
                    disabled
                    className="w-full px-3 py-2 border text-slate-500 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                        Selecciona un grupo de impresora
                    </option>
                    {tipoContratos.map((tipo) => (
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
                        text-white bg-slate-800 rounded-lg shadow-md hover:bg-slate-700 focus:outline-none 
                        focus:ring-2 focus:ring-offset-2 focus:ring-slate-800 transition-colors hover:cursor-pointer
                        ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                        ${
                            errors.length > 0
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }
                        `}
                >
                    Asignar Impresora
                </button>
            </div>
        </form>
    );
};
