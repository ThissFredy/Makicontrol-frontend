import React, { useEffect, useState } from "react";
import type { GetReadyType } from "@/types/counterType";
import { Slider } from "@/components/ui/counter/Slider";
import { toast } from "react-hot-toast";

interface CreateContractFormProps {
    onClose: () => void;
    onSuccess: (message: string, data: GetReadyType) => void;
    clienteNit: string;
}

export const CreateCounter = ({
    onClose,
    onSuccess,
    clienteNit,
}: CreateContractFormProps) => {
    const [dataForm, setData] = useState<GetReadyType[]>([]);

    const successHandler = (message: string, data: GetReadyType[]) => {
        toast.success(message);
        setData(data);
    };

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
                                <h3 className="flex gap-4 text-md font-bold text-[#E87A3E] border-b border-slate-200 pb-2 mb-4">
                                    Equipo:
                                    <div className="flex text-black font-semibold">
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
                                    <div>
                                        <span className="font-semibold text-slate-600">
                                            Contador Actual:{" "}
                                        </span>
                                        <span className="text-black font-semibold">
                                            {item.contadorActual ?? "N/A"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-slate-600">
                                            Consumo:{" "}
                                        </span>
                                        <span className="font-mono font-bold bg-green-100 px-2 py-1 rounded-md text-green-800">
                                            {item.consumo ?? "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
