import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { downloadReceiptService } from "@/services/customerService";
import { toast } from "react-hot-toast";

interface AddCounters1Props {
    onSuccess: (message: string) => void;
    clientNit: string;
    Titulo?: string;
    Subtitulo?: string;
}

const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
];

export const SliderCheckout = ({
    onSuccess,
    clientNit,
    Titulo = "Registro de Contadores Mensuales",
    Subtitulo = "Seleccione un periodo para ingresar las lecturas",
}: AddCounters1Props) => {
    const currentYear = new Date().getFullYear();
    const [loading, setLoading] = useState(false);
    const currentMonth = new Date().getMonth() + 1;

    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth);

    const handleDownloadReceipt = async () => {
        setLoading(true);
        try {
            const response = await downloadReceiptService(
                parseInt(clientNit),
                year,
                month
            );
            if (response.status && response.data) {
                const { blob, estadoFactura } = response.data;

                const fileURL = URL.createObjectURL(blob);
                window.open(fileURL, "_blank");

                setTimeout(() => {
                    URL.revokeObjectURL(fileURL);
                }, 100);

                onSuccess(
                    estadoFactura
                        ? "Copia de factura descargada"
                        : "Factura generada correctamente"
                );
            } else
                toast.error(response.message || "Error al cargar contadores");
        } catch (e) {
            toast.error("Error al cargar contadores: " + (e as Error).message);
        }
        setLoading(false);
    };

    return (
        <div>
            {/* --- Encabezado --- */}
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-slate-800">{Titulo}</h2>
                <p className="mt-1 text-slate-500">{Subtitulo}</p>
            </div>

            <div className="space-y-8">
                {/* --- Year --- */}
                <div>
                    <label
                        htmlFor="year-slider"
                        className="block text-sm font-medium text-slate-700"
                    >
                        <div className="flex justify-between items-center">
                            <span>Año</span>
                            <span className="text-lg font-bold text-blue-600 bg-blue-100 rounded-md px-2">
                                {year}
                            </span>
                        </div>
                    </label>
                    <input
                        id="year-slider"
                        type="range"
                        min={currentYear - 20}
                        max={currentYear}
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                        className="w-full h-2 mt-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                {/* --- Month --- */}
                <div>
                    <label
                        htmlFor="month-slider"
                        className="block text-sm font-medium text-slate-700"
                    >
                        <div className="flex justify-between items-center">
                            <span>Mes</span>
                            <span className="text-lg font-bold text-blue-600 bg-blue-100 rounded-md px-2">
                                {monthNames[month - 1]}
                            </span>
                        </div>
                    </label>
                    <input
                        id="month-slider"
                        type="range"
                        min="1"
                        max="12"
                        value={month}
                        onChange={(e) => setMonth(parseInt(e.target.value))}
                        className="w-full h-2 mt-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>
            </div>

            {/* --- Botón de Acción --- */}
            <div className="mt-10">
                <Button
                    className="w-full"
                    onClick={handleDownloadReceipt}
                    disabled={loading}
                >
                    {loading ? "Cargando..." : "Cargar Contadores"}
                </Button>
            </div>
        </div>
    );
};
