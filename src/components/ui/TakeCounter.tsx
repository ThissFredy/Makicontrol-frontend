import React, { useState, useMemo } from "react";
import type { CounterByNIT } from "@/types/counterType";
import { SliderViewCounter } from "@/components/ui/counter/SliderViewCounter";
import { Button } from "@/components/ui/Button";

// Este es el tipo que usaremos en el estado para tener toda la info necesaria
interface CounterViewData extends CounterByNIT {
    modelo: string;
    contadorAnterior: number;
}

interface TakeCounterProps {
    onClose: () => void;
    onSuccess?: (message: string) => void;
    clienteNit: string;
}

export const TakeCounter = ({
    onClose,
    clienteNit,
    onSuccess,
}: TakeCounterProps) => {
    // --- ESTADO SIMPLIFICADO ---
    // Usamos el nuevo tipo que incluye el modelo y el contador anterior
    const [dataForm, setData] = useState<CounterViewData[]>([]);
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(new Date().getFullYear());

    // La función que llama el Slider cuando obtiene los datos
    const successHandler = (
        message: string,
        response: CounterByNIT[],
        month: number,
        year: number
    ) => {
        if (onSuccess) {
            onSuccess(message);
        }
        const data: CounterViewData[] = response.map((item) => ({
            ...item,
            modelo: (item as any).modelo ?? "", // eslint-disable-line @typescript-eslint/no-explicit-any
            contadorAnterior: (item as any).contadorAnterior ?? 0, // eslint-disable-line @typescript-eslint/no-explicit-any
        }));
        setData(data);
        setMonth(month);
        setYear(year);
    };

    // --- AJUSTE CLAVE EN LA AGRUPACIÓN ---
    const groupedData = useMemo(() => {
        // Ahora el reduce espera el tipo correcto
        return dataForm.reduce<
            Record<string, { modelo: string; operations: CounterViewData[] }>
        >((acc, item) => {
            // Usamos 'serialImpresora' en lugar de 'serial'
            const key = item.serialImpresora;
            if (!acc[key]) {
                acc[key] = {
                    modelo: item.modelo, // Ahora tenemos el modelo
                    operations: [],
                };
            }
            acc[key].operations.push(item);
            return acc;
        }, {});
    }, [dataForm]);

    return (
        <div>
            {dataForm.length === 0 ? (
                <SliderViewCounter
                    onSuccess={successHandler}
                    clientNit={clienteNit}
                    Titulo="Consultar Contadores"
                    Subtitulo="Seleccione un periodo para visualizar los contadores registrados"
                />
            ) : (
                <div>
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-slate-800">
                            Contadores Registrados para {year}-
                            {String(month).padStart(2, "0")}
                        </h2>
                        <p className="mt-1 text-slate-500">
                            Estos son los contadores registrados en el periodo
                            seleccionado.
                        </p>
                    </div>

                    <div className="max-h-[65vh] overflow-y-auto space-y-4 p-4 bg-slate-50 rounded-lg border">
                        <div className="flex gap-6 overflow-x-auto">
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

                                        <div className="space-y-5">
                                            {group.operations.map((item) => {
                                                const consumo = Math.abs(
                                                    item.cantidad -
                                                        item.contadorAnterior
                                                );

                                                return (
                                                    <div
                                                        key={`${serial}-${item.tipoOperacion}`}
                                                    >
                                                        <p className="text-sm font-bold text-slate-700 mb-2">
                                                            {item.tipoOperacion}
                                                        </p>
                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                                            {/* --- CAMBIO DE RENDERIZADO: DE INPUT A TEXTO --- */}
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
                                                                <span className="font-semibold text-slate-500">
                                                                    Cont.
                                                                    Actual:
                                                                </span>
                                                                <span className="font-mono bg-blue-100 text-blue-800 font-bold px-2 py-1 rounded-md">
                                                                    {
                                                                        item.cantidad
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="col-span-2 flex justify-between items-center">
                                                                <span className="font-semibold text-slate-500">
                                                                    Consumo:
                                                                </span>
                                                                <span className="font-mono font-bold px-2 py-1 rounded-md bg-green-100 text-green-800">
                                                                    {consumo}
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
                    {/* --- BOTÓN DE CIERRE --- */}
                    <Button className="mt-6 w-full" onClick={onClose}>
                        Cerrar
                    </Button>
                </div>
            )}
        </div>
    );
};
