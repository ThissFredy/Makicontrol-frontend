import React, { useEffect, useState } from "react";
import type { GetReadyType, RegisterCounterType } from "@/types/counterType";
import { Slider } from "@/components/ui/counter/Slider";
import { toast } from "react-hot-toast";
import type { ErrorFieldType } from "@/types/errorType";
import {
    registerCounterService,
    registerCountersService,
} from "@/services/counterService";
import {
    validateCounterCreate,
    validateCounterCreateArray,
} from "@/utilities/validateCounter";
import { Button } from "@/components/ui/Button";
import { formatNumber } from "@/utilities/moneyUtility";

interface CreateContractFormProps {
    onClose: () => void;
    onSuccess: (message: string) => void;
    clienteNit: string;
}

export const CreateCounter = ({
    onClose,
    onSuccess,
    clienteNit,
}: CreateContractFormProps) => {
    const [dataForm, setData] = useState<GetReadyType[]>([]);
    const [loading, setLoading] = useState(false);
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [error, setError] = useState<ErrorFieldType[]>([]);
    const [registerMassiveData, setRegisterMassiveData] = useState<
        RegisterCounterType[]
    >([]);

    const successHandler = (
        message: string,
        data: GetReadyType[],
        month: number,
        year: number
    ) => {
        toast.success(message);
        setData(data);
        setMonth(month);
        setYear(year);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        setData((prev) => {
            const updatedData = [...prev];
            updatedData[index].contadorActual = e.target.value;
            return updatedData;
        });

        const data: RegisterCounterType = {
            serialImpresora: dataForm[index].serial,
            anio: year.toString(),
            mes: month.toString(),
            tipoOperacion: dataForm[index].tipoOperacion,
            cantidad: e.target.value,
        };
        setRegisterMassiveData((prev) => {
            const updatedData = [...prev];
            updatedData[index] = {
                serialImpresora: dataForm[index].serial,
                anio: year.toString(),
                mes: month.toString(),
                tipoOperacion: dataForm[index].tipoOperacion,
                cantidad: e.target.value,
            };
            return updatedData;
        });
    };

    useEffect(() => {
        const handleValidate = () => {
            // Filtrar elementos undefined antes de validar
            const validData = registerMassiveData.filter(
                (item) => item !== undefined
            );
            const errors = validateCounterCreateArray(validData);

            if (errors.length > 0) {
                setError(errors);
                return false;
            } else {
                setError([]);
                return true;
            }
        };
        handleValidate();
    }, [registerMassiveData]);

    const handleSubmit = async () => {
        setLoading(true);
        if (error.length > 0) {
            setLoading(false);
            return;
        }

        // Filtrar elementos undefined antes de enviar
        const validData = registerMassiveData.filter(
            (item) => item !== undefined
        );

        try {
            if (validData.length === 1) {
                const response = await registerCounterService(validData);
                if (response.status) {
                    onSuccess("Contador registrado con éxito");
                    onClose();
                } else {
                    toast.error(
                        response.message || "Error al registrar contador"
                    );
                }
            } else {
                const response = await registerCountersService(validData);
                if (response.status) {
                    onSuccess("Contadores registrados con éxito");
                    onClose();
                } else {
                    toast.error(
                        response.message || "Error al registrar contadores"
                    );
                }
            }
        } catch (error) {
            toast.error("Error al registrar contadores");
        } finally {
            setLoading(false);
        }
    };

    console.log("Data Form:", registerMassiveData);

    return (
        <div>
            {dataForm.length === 0 ? (
                <Slider onSuccess={successHandler} clientNit={clienteNit} />
            ) : (
                <div>
                    {/* --- Título de la sección --- */}
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-slate-800">
                            Resumen de Contadores a Registrar
                        </h2>
                        <p className="mt-1 text-slate-500">
                            Revise los datos cargados para cada equipo.
                        </p>
                    </div>

                    <div className="max-h-[65vh] overflow-y-auto space-y-4 p-4 bg-slate-50 rounded-lg border">
                        {dataForm.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white p-5 rounded-xl shadow-md border border-slate-200"
                            >
                                <h3 className="flex gap-4 text-md font-bold text-[#253763] border-b border-slate-200 pb-2 mb-4">
                                    Equipo:
                                    <div className="flex text-slate-600 italic font-semibold">
                                        {item.serial}
                                    </div>
                                    <div className="flex text-slate-600 font-medium">
                                        {item.modelo}
                                    </div>
                                </h3>

                                {/* --- Grid para alinear los datos --- */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                    <div>
                                        <span className="font-semibold text-slate-600 ">
                                            Operación:{" "}
                                        </span>
                                        <span className="text-black font-semibold">
                                            {item.tipoOperacion}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-slate-600">
                                            Contador Anterior:{" "}
                                        </span>
                                        <span className="font-mono bg-slate-100 px-2 py-1 rounded-md text-slate-800">
                                            {item.contadorAnterior}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-slate-600">
                                            Contador Actual:{" "}
                                        </span>
                                        <span className="text-black font-semibold">
                                            <input
                                                type="text"
                                                className="bg-slate-100 px-2 py-1 rounded-md text-slate-800 w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                                                value={
                                                    item.contadorActual || ""
                                                }
                                                placeholder="Ingrese contador actual"
                                                onChange={(e) =>
                                                    handleChange(e, index)
                                                }
                                            />
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-slate-600">
                                            Consumo:{" "}
                                        </span>
                                        {item.consumo ? (
                                            <span className="font-mono font-bold bg-green-100 px-2 py-1 rounded-md text-green-800">
                                                {item.consumo}
                                            </span>
                                        ) : Number(item.contadorAnterior) -
                                              Number(item.contadorActual) <
                                          0 ? (
                                            <span className="font-mono font-bold bg-green-100 px-2 py-1 rounded-md text-green-800">
                                                {Math.abs(
                                                    Number(
                                                        item.contadorAnterior
                                                    ) -
                                                        Number(
                                                            item.contadorActual
                                                        )
                                                )}
                                            </span>
                                        ) : Number(item.contadorAnterior) -
                                              Number(item.contadorActual) >
                                          0 ? (
                                            <span className="font-mono font-bold bg-red-100 px-2 py-1 rounded-md text-red-900">
                                                {Math.abs(
                                                    Number(
                                                        item.contadorAnterior
                                                    ) -
                                                        Number(
                                                            item.contadorActual
                                                        )
                                                )}
                                            </span>
                                        ) : (
                                            <span className="font-mono font-bold bg-yellow-100 px-2 py-1 rounded-md text-yellow-800">
                                                {Number(item.contadorAnterior) -
                                                    Number(item.contadorActual)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Errores */}
                    {error.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-red-600 font-semibold">
                                Errores:
                            </h3>
                            <ul className="list-disc pl-5 text-red-500">
                                {error.map((err, index) => (
                                    <li key={index}>{err.field.value}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <Button
                        className={`mt-6 w-full ${
                            error.length === 0
                                ? loading
                                    ? "opacity-50 cursor-not-allowed"
                                    : registerMassiveData.length > 0
                                    ? "bg-[#1A2541]"
                                    : "opacity-50 cursor-not-allowed"
                                : "opacity-50 cursor-not-allowed"
                        }`}
                        onClick={handleSubmit}
                    >
                        Registrar Contadores
                    </Button>
                </div>
            )}
        </div>
    );
};
