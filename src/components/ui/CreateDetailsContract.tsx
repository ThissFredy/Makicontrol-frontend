import React from "react";
import { useEffect } from "react";
import type { CreateContractDetailType } from "@/types/contractType";
import { validateCreateDetailsContract } from "@/utilities/validateContract";
import type { ErrorFieldType } from "@/types/errorType";
import {
    getOperationsTypesService,
    createContractDetailsService,
    getCashMethodService,
} from "@/services/contractService";
import { useState } from "react";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { toast } from "react-hot-toast";

interface CreateDetailsContractProps {
    onClose: () => void;
    onSuccess: (message: string) => void;
    clienteNIT: string;
}

export const CreateDetailsContract = ({
    onClose,
    onSuccess,
    clienteNIT,
}: CreateDetailsContractProps) => {
    const [dataForm, setData] = useState<CreateContractDetailType>({
        clienteNit: "",
        tipoOperacion: "",
        limiteIncluido: 0,
        valorUnitario: 0,
        valorBase: 0,
        modoCobro: "",
    });

    useEffect(() => {
        if (clienteNIT) {
            setData((prevData) => ({
                ...prevData,
                clienteNit: clienteNIT,
            }));
        }
    }, [clienteNIT]);

    const [errors, setErrors] = useState<ErrorFieldType[]>([]);
    const [cashMethods, setCashMethods] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [tiposOperacion, setTiposOperacion] = useState<string[]>([
        "ERROR AL OBTENER TIPOS DE OPERACION",
    ]);

    useEffect(() => {
        const fetchTiposOperacion = async () => {
            const response = await getOperationsTypesService();
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

    // useEffect for fetching cash methods
    useEffect(() => {
        const fetchCashMethods = async () => {
            const response = await getCashMethodService();
            if (response.status) {
                setCashMethods(response.data);
            } else {
                console.error(
                    "Error al obtener métodos de pago:",
                    response.message
                );
            }
        };

        fetchCashMethods();
    }, []);

    const handleChange = async (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        const data = {
            ...dataForm,
            [name]: value,
        };
        setData(data);

        const validationErrors = await validateCreateDetailsContract(data);
        setErrors(validationErrors);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = await validateCreateDetailsContract(dataForm);
        setErrors(validationErrors);

        if (validationErrors.length > 0) {
            return;
        }

        setIsLoading(true);
        const response = await createContractDetailsService(dataForm);
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
                    Crear Detalles Contrato
                </h2>
                <p className="mt-1 text-slate-500">
                    Completa la información para crear los detalles de contrato.
                </p>
            </div>

            <div>
                <label
                    htmlFor="ClienteNit"
                    className="block text-sm font-medium text-slate-600 mb-1"
                >
                    NIT Cliente
                </label>
                <input
                    type="text"
                    id="clienteNit"
                    name="clienteNit"
                    value={dataForm.clienteNit}
                    disabled
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-600"
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
                    htmlFor="tipoOperacion"
                    className="block text-sm font-medium text-slate-600 mb-1"
                >
                    Tipo de Operación
                </label>
                <select
                    id="tipoOperacion"
                    name="tipoOperacion"
                    value={dataForm.tipoOperacion}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="" disabled>
                        Selecciona un tipo de operación
                    </option>
                    {tiposOperacion.map((tipo) => (
                        <option key={tipo} value={tipo}>
                            {tipo.replace(/_/g, " ")}
                        </option>
                    ))}
                </select>
                <span className="text-red-500 text-sm">
                    {
                        errors.find(
                            (error) => error.field.name === "tipoOperacion"
                        )?.field.value
                    }
                </span>
            </div>

            <div>
                <label
                    htmlFor="limiteIncluido"
                    className="block text-sm font-medium text-slate-600 mb-1"
                >
                    Límite Incluido
                </label>
                <input
                    id="limiteIncluido"
                    name="limiteIncluido"
                    value={dataForm.limiteIncluido}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-red-500 text-sm">
                    {
                        errors.find(
                            (error) => error.field.name === "limiteIncluido"
                        )?.field.value
                    }
                </span>
            </div>

            <div>
                <label
                    htmlFor="valorUnitario"
                    className="block text-sm font-medium text-slate-600 mb-1"
                >
                    Valor Unitario
                </label>
                <CurrencyInput
                    id="valorUnitario"
                    name="valorUnitario"
                    input={true}
                    value={dataForm.valorUnitario}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-red-500 text-sm">
                    {
                        errors.find(
                            (error) => error.field.name === "valorUnitario"
                        )?.field.value
                    }
                </span>
            </div>

            <div>
                <label
                    htmlFor="valorBase"
                    className="block text-sm font-medium text-slate-600 mb-1"
                >
                    Valor Base
                </label>
                <CurrencyInput
                    id="valorBase"
                    name="valorBase"
                    input={true}
                    value={dataForm.valorBase}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-red-500 text-sm">
                    {
                        errors.find((error) => error.field.name === "valorBase")
                            ?.field.value
                    }
                </span>
            </div>

            <div>
                <label
                    htmlFor="modoCobro"
                    className="block text-sm font-medium text-slate-600 mb-1"
                >
                    Modo de Cobro
                </label>
                <select
                    id="modoCobro"
                    name="modoCobro"
                    value={dataForm.modoCobro}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="" disabled>
                        Selecciona un modo de cobro
                    </option>
                    {cashMethods.map((tipo) => (
                        <option key={tipo} value={tipo}>
                            {tipo.replace(/_/g, " ")}
                        </option>
                    ))}
                </select>
                <span className="text-red-500 text-sm">
                    {
                        errors.find((error) => error.field.name === "modoCobro")
                            ?.field.value
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
                    Crear Detalles
                </button>
            </div>
        </form>
    );
};
