import { useEffect } from "react";
import { validateCreate } from "@/utilities/validateContract";
import type { ErrorFieldType } from "@/types/errorType";
import {
    createContractService,
    getTypesOfContractsService,
} from "@/services/contractService";
import type { ContractType, Canon, CanonGroup } from "@/types/contractType";

interface CreateContractFormProps {
    onClose: () => void;
    onSuccess: (message: string, data: ContractType) => void;
}

export const CreateContractForm = ({
    onClose,
    onSuccess,
}: CreateContractFormProps) => {
    const [dataForm, setData] = React.useState<ContractType>({
        clienteNit: 0,
        tipoContrato: "CANON_FIJO",
        valorCanon: 0,
        valorBaseEquipo: 0,
        periodo: "MENSUAL",
        fechaInicio: "",
        fechaFin: null,
        estado: "ACTIVO",
        canones: [],
    });

    const [tipoContratos, setTipoContratos] = React.useState<string[]>([
        "ERROR AL OBTENER TIPOS DE CONTRATO",
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

    const [canonGroups] = React.useState<CanonGroup[]>([
        "BN",
        "COLOR",
        "ZEBRA",
        "ESCANER",
    ]);
    const [errors, setErrors] = React.useState<ErrorFieldType[]>([]);

    const [isLoading, setIsLoading] = React.useState(false);
    const [apiError, setApiError] = React.useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        const parsedValue = name === "nit" ? parseFloat(value) || "" : value;

        const data = { ...dataForm, [name]: parsedValue };
        setData(data);

        const validationErrors = validateCreate(data);
        setErrors(validationErrors);
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Remover todos los caracteres no numéricos excepto puntos
        const numericValue = value.replace(/[^\d]/g, "");

        // Convertir a número
        const numberValue = parseInt(numericValue) || 0;

        // Actualizar el estado con el número
        const data = { ...dataForm, [name]: numberValue };
        setData(data);

        const validationErrors = validateCreate(data);
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

    const formatNumber = (value: number): string => {
        return new Intl.NumberFormat("es-CO").format(value);
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
        const response = await createContractService(dataForm);

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
        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                    Crear Nuevo Contrato
                </h2>
                <p className="mt-1 text-slate-500">
                    Completa la información para crear un nuevo contrato.
                </p>
            </div>

            <div className="space-y-4">
                {apiError && (
                    <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
                        <p>{apiError}</p>
                    </div>
                )}
            </div>

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
                    {tipoContratos.map((tipo) => (
                        <option key={tipo} value={tipo}>
                            {tipo.replace(/_/g, " ")}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label
                    htmlFor="valorCanon"
                    className="block text-sm font-medium text-slate-600 mb-1"
                >
                    Valor del Canon
                </label>
                <input
                    type="text"
                    id="valorCanon"
                    name="valorCanon"
                    value={formatNumber(dataForm.valorCanon)}
                    onChange={handlePriceChange}
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
                    Valor Base del Equipo
                </label>
                <input
                    type="text"
                    id="valorBaseEquipo"
                    name="valorBaseEquipo"
                    value={formatNumber(dataForm.valorBaseEquipo)}
                    onChange={handlePriceChange}
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
                            {canonGroups.map((group) => (
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
                    Crear Contrato
                </button>
            </div>
        </form>
    );
};
