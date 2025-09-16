import React, { useEffect } from "react";
import { validateCreate } from "@/utilities/validateContract";
import type { ErrorFieldType } from "@/types/errorType";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { toast } from "react-hot-toast";
import {
    createContractService,
    getTypesOfContractsService,
    getTypesOfCanonService,
} from "@/services/contractService";
import type { ContractType, Canon } from "@/types/contractType";

interface CreateContractFormProps {
    onClose: () => void;
    onSuccess: (message: string, data: ContractType) => void;
}

export const CreateContractForm = ({
    onClose,
    onSuccess,
}: CreateContractFormProps) => {
    const [dataForm, setData] = React.useState<ContractType>({
        clienteNit: "",
        tipoContrato: "",
        valorCanon: "",
        valorBaseEquipo: "",
        periodo: "MENSUAL",
        fechaInicio: "",
        fechaFin: null,
        estado: "ACTIVO",
        canones: [],
    });

    const [tipoContratos, setTipoContratos] = React.useState<string[]>([""]);

    const [tiposCanon, setTiposCanon] = React.useState<string[]>([
        "ERROR AL OBTENER TIPOS DE CANON",
    ]);

    useEffect(() => {
        const fetchTiposContratos = async () => {
            const response = await getTypesOfContractsService();
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

    useEffect(() => {
        const fetchTiposCanon = async () => {
            const response = await getTypesOfCanonService();
            if (response.status) {
                setTiposCanon(response.data);
            } else {
                console.error(
                    "Error al obtener tipos de canon:",
                    response.message
                );
            }
        };

        fetchTiposCanon();
    }, []);

    const [errors, setErrors] = React.useState<ErrorFieldType[]>([]);

    const [isLoading, setIsLoading] = React.useState(false);

    const handleChange = async (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        console.log("Evento de cambio:", e.target.name, e.target.value);
        const { name, value } = e.target;
        const parsedValue = name === "nit" ? parseFloat(value) || "" : value;

        const data = { ...dataForm, [name]: parsedValue };
        setData(data);

        const validationErrors = await validateCreate(data);
        setErrors(validationErrors);
    };

    const handleAddCanon = () => {
        setData((prevData) => ({
            ...prevData,
            canones: [...prevData.canones, { grupo: "BN", valorCanon: 0 }],
        }));
    };

    const handleRemoveCanon = (index: number) => {
        setData((prevData) => ({
            ...prevData,
            canones: prevData.canones.filter((_, i) => i !== index),
        }));
    };

    const handleCanonChange = (
        index: number,
        field: keyof Canon,
        value: string | number
    ) => {
        setData((prevData) => {
            const newCanones = [...prevData.canones];
            newCanones[index] = {
                ...newCanones[index],
                [field]: value,
            };
            return {
                ...prevData,
                canones: newCanones,
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = await validateCreate(dataForm);
        setErrors(validationErrors);

        if (validationErrors.length > 0) {
            return;
        }

        setIsLoading(true);
        const response = await createContractService(dataForm);

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
                    Crear Nuevo Contrato
                </h2>
                <p className="mt-1 text-slate-500">
                    Completa la información para crear un nuevo contrato.
                </p>
            </div>

            <div className="space-y-4"></div>

            <div>
                <label
                    htmlFor="ClienteNit"
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
                    htmlFor="tipoContrato"
                    className="block text-sm font-medium text-slate-600 mb-1"
                >
                    Tipo de Contrato
                </label>
                <select
                    id="tipoContrato"
                    name="tipoContrato"
                    value={dataForm.tipoContrato}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="" disabled>
                        Selecciona un tipo de contrato
                    </option>
                    {tipoContratos.map((tipo) => (
                        <option key={tipo} value={tipo}>
                            {tipo.replace(/_/g, " ")}
                        </option>
                    ))}
                </select>
                <span className="text-red-500 text-sm">
                    {
                        errors.find(
                            (error) => error.field.name === "tipoContrato"
                        )?.field.value
                    }
                </span>
            </div>

            <div>
                <label
                    htmlFor="valorCanon"
                    className="block text-sm font-medium text-slate-600 mb-1"
                >
                    Valor del Canon (opcional)
                </label>
                <CurrencyInput
                    id="valorCanon"
                    name="valorCanon"
                    onChange={handleChange}
                    value={dataForm.valorCanon}
                    input={true}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-red-500 text-sm">
                    {
                        errors.find(
                            (error) => error.field.name === "valorCanon"
                        )?.field.value
                    }
                </span>
            </div>

            <div>
                <label
                    htmlFor="valorBaseEquipo"
                    className="block text-sm font-medium text-slate-600 mb-1"
                >
                    Valor Base del Equipo (opcional)
                </label>
                <CurrencyInput
                    id="valorBaseEquipo"
                    name="valorBaseEquipo"
                    onChange={handleChange}
                    value={dataForm.valorBaseEquipo}
                    input={true}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-red-500 text-sm">
                    {
                        errors.find(
                            (error) => error.field.name === "valorBaseEquipo"
                        )?.field.value
                    }
                </span>
            </div>

            <div>
                <label
                    htmlFor="periodo"
                    className="block text-sm font-medium text-slate-600 mb-1"
                >
                    Periodo
                </label>
                <input
                    type="text"
                    id="periodo"
                    name="periodo"
                    value={dataForm.periodo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-red-500 text-sm">
                    {
                        errors.find((error) => error.field.name === "periodo")
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

            <div>
                <label
                    htmlFor="fechaFin"
                    className="block text-sm font-medium text-slate-600 mb-1"
                >
                    Fecha de Fin (opcional)
                </label>
                <input
                    type="date"
                    id="fechaFin"
                    name="fechaFin"
                    value={dataForm.fechaFin || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-red-500 text-sm">
                    {
                        errors.find((error) => error.field.name === "fechaFin")
                            ?.field.value
                    }
                </span>
            </div>

            <div>
                <label
                    htmlFor="estado"
                    className="block text-sm font-medium text-slate-600 mb-1"
                >
                    Estado
                </label>
                <select
                    id="estado"
                    name="estado"
                    value={dataForm.estado}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="ACTIVO">Activo</option>
                    <option value="INACTIVO">Inactivo</option>
                </select>
                <span className="text-red-500 text-sm">
                    {
                        errors.find((error) => error.field.name === "estado")
                            ?.field.value
                    }
                </span>
            </div>

            {/* Canones Section */}
            {dataForm.tipoContrato === "CANON_CONSUMO" && (
                <div className="mt-6">
                    <h3 className="text-lg font-medium text-slate-700 mb-2">
                        Cánones
                    </h3>
                    {dataForm.canones.map((canon, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 mb-2 p-2 border border-slate-200 rounded-lg"
                        >
                            <select
                                value={canon.grupo}
                                onChange={(e) =>
                                    handleCanonChange(
                                        index,
                                        "grupo",
                                        e.target.value
                                    )
                                }
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                            >
                                {tiposCanon.map((group) => (
                                    <option key={group} value={group}>
                                        {group}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Valor del Canon"
                                value={canon.valorCanon}
                                onChange={(e) =>
                                    handleCanonChange(
                                        index,
                                        "valorCanon",
                                        e.target.value
                                    )
                                }
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveCanon(index)}
                                className="px-3 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600"
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddCanon}
                        className="mt-2 px-4 py-2 font-semibold text-white bg-slate-800 rounded-lg hover:bg-slate-700"
                    >
                        Agregar Canon
                    </button>
                </div>
            )}

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
                        focus:ring-2 focus:ring-offset-2 focus:ring-slate-800 transition-colors
                        ${
                            errors.length > 0
                                ? "opacity-50 hover:cursor-not-allowed bg-slate-800 hover:none"
                                : "hover:cursor-pointer"
                        }
                        `}
                >
                    Crear Contrato
                </button>
            </div>
        </form>
    );
};
