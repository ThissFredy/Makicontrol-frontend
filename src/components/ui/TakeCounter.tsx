import React, { useEffect, useState, useMemo } from "react";
import type { GetReadyType, RegisterCounterType } from "@/types/counterType";
import { Slider } from "@/components/ui/counter/Slider";
import { toast } from "react-hot-toast";
import type { ErrorFieldType } from "@/types/errorType";
import { registerCountersService } from "@/services/counterService";
import { validateCounterCreateArray } from "@/utilities/validateCounter";
import { Button } from "@/components/ui/Button";

interface CreateContractFormProps {
    onClose: () => void;
    onSuccess: (message: string) => void;
    clienteNit: string;
}

export const TakeCounter = ({
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
        setRegisterMassiveData(new Array(data.length));
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        // Actualiza el estado visual (dataForm)
        setData((prev) => {
            const updatedData = [...prev];
            updatedData[index] = {
                ...updatedData[index],
                contadorActual: e.target.value,
            };
            return updatedData;
        });

        // Actualiza el estado de los datos a enviar (registerMassiveData)
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

    // Agrupa los datos por serial de impresora para la vista
    const groupedData = useMemo(() => {
        return dataForm.reduce<
            Record<string, { modelo: string; operations: GetReadyType[] }>
        >((acc, item) => {
            const key = item.serial;
            if (!acc[key]) {
                acc[key] = {
                    modelo: item.modelo,
                    operations: [],
                };
            }
            acc[key].operations.push(item);
            return acc;
        }, {});
    }, [dataForm]);

    useEffect(() => {
        const handleValidate = () => {
            const validData = registerMassiveData.filter(
                (item) => item !== undefined
            );
            const errors: ErrorFieldType[] =
                validateCounterCreateArray(validData);

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
            toast.error("Por favor, corrija los errores antes de continuar.");
            setLoading(false);
            return;
        }

        const validData = registerMassiveData.filter(
            (item) => item !== undefined
        );

        if (validData.length === 0) {
            toast.error("Debe ingresar al menos un contador actual.");
            setLoading(false);
            return;
        }

        try {
            const response = await registerCountersService(validData);
            if (response.status) {
                onSuccess("Contadores registrados con éxito");
                onClose();
            } else {
                toast.error(
                    response.message || "Error al registrar contadores"
                );
            }
        } catch (e) {
            toast.error(
                "Error en la conexión al registrar contadores: " +
                    (e as Error).message
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {dataForm.length === 0 ? (
                <Slider
                    onSuccess={successHandler}
                    clientNit={clienteNit}
                    Titulo="Obtención de Contadores"
                    Subtitulo="Seleccione un periodo para visualizar"
                />
            ) : (
                <div>
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-slate-800">
                            Obten todos los contadores asociados al cliente
                        </h2>
                        <p className="mt-1 text-slate-500">
                            Revisa los contadores actuales y anteriores
                        </p>
                    </div>

                    <div className="max-h-[80vh] overflow-y-auto space-y-4 p-4 bg-slate-50 rounded-lg border">
                        {/* --- Contenedor Grid Responsive --- */}
                        <div className="flex gap-6 overflow-x-auto overflow-y-hidden">
                            {/* Mapeo sobre los datos agrupados */}
                            {Object.keys(groupedData).map((serial) => {
                                const group = groupedData[serial];
                                return (
                                    <div
                                        key={serial}
                                        className="bg-white p-5 rounded-xl shadow-md border border-slate-200 flex flex-col min-w-[300px]"
                                    >
                                        <h3 className="text-md font-bold text-[#253763] border-b border-slate-200 pb-3 mb-4">
                                            Equipo:
                                            <div className="flex flex-col mt-1">
                                                <span className="text-slate-700 italic font-semibold">
                                                    {serial}
                                                </span>
                                                <span className="text-slate-500 font-medium text-sm">
                                                    {group.modelo}
                                                </span>
                                            </div>
                                        </h3>

                                        {/* Mapeo de las operaciones para este equipo */}
                                        <div className="space-y-5">
                                            {group.operations.map((item) => {
                                                // Encontramos el índice original en el array plano para que handleChange funcione
                                                const originalIndex =
                                                    dataForm.findIndex(
                                                        (dfItem) =>
                                                            dfItem.tipoOperacion ===
                                                                item.tipoOperacion &&
                                                            dfItem.serial ===
                                                                item.serial
                                                    );

                                                const consumo = Math.abs(
                                                    Number(
                                                        item.contadorActual || 0
                                                    ) -
                                                        Number(
                                                            item.contadorAnterior
                                                        )
                                                );
                                                const isValidConsumo =
                                                    !isNaN(consumo) &&
                                                    item.contadorActual;

                                                return (
                                                    <div
                                                        key={`${serial}-${item.tipoOperacion}`}
                                                    >
                                                        <p className="text-sm font-bold text-slate-700 mb-2">
                                                            {item.tipoOperacion}
                                                        </p>
                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                                            <div className="col-span-2 flex justify-between items-center">
                                                                <span className="font-semibold text-slate-500">
                                                                    Cont.
                                                                    Anterior:
                                                                </span>
                                                                <span className="font-mono bg-slate-100 px-2 py-1 rounded-md text-slate-800">
                                                                    {
                                                                        item.contadorAnterior
                                                                    }
                                                                </span>
                                                            </div>

                                                            <div className="col-span-2 flex justify-between items-center">
                                                                <label
                                                                    htmlFor={`contador-${originalIndex}`}
                                                                    className="font-semibold text-slate-500"
                                                                >
                                                                    Cont.
                                                                    Actual:
                                                                </label>
                                                                <input
                                                                    id={`contador-${originalIndex}`}
                                                                    type="number"
                                                                    className="font-mono bg-slate-100 px-2 py-1 rounded-md text-slate-800 w-28 text-right border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                                                    value={
                                                                        item.contadorActual ||
                                                                        ""
                                                                    }
                                                                    placeholder="0"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleChange(
                                                                            e,
                                                                            originalIndex
                                                                        )
                                                                    }
                                                                />
                                                            </div>

                                                            <div className="col-span-2 flex justify-between items-center">
                                                                <span className="font-semibold text-slate-500">
                                                                    Consumo:
                                                                </span>
                                                                <span
                                                                    className={`font-mono font-bold px-2 py-1 rounded-md ${
                                                                        isValidConsumo
                                                                            ? "bg-green-100 text-green-800"
                                                                            : "bg-yellow-100 text-yellow-800"
                                                                    }`}
                                                                >
                                                                    {isValidConsumo
                                                                        ? consumo
                                                                        : 0}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* El resto de tu lógica para errores y el botón de submit se mantiene igual */}
                    {error.length > 0 && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <h3 className="text-red-700 font-semibold text-sm">
                                Errores de validación:
                            </h3>
                            <ul className="list-disc pl-5 text-red-600 text-sm mt-1">
                                {error.map((err, index) => (
                                    <li key={index}>{err.field.value}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <Button
                        className={`mt-6 w-full disabled:opacity-50 disabled:cursor-not-allowed`}
                        onClick={handleSubmit}
                        disabled={
                            loading ||
                            error.length > 0 ||
                            registerMassiveData.filter((i) => i).length === 0
                        }
                    >
                        {loading ? "Registrando..." : "Registrar Contadores"}
                    </Button>
                </div>
            )}
        </div>
    );
};
