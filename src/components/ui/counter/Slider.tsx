import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { getReadyService } from "@/services/counterService";
import type { GetReadyType } from "@/types/counterType";
import { toast } from "react-hot-toast";
import { Calendar, Clock, Download, DollarSign } from "lucide-react";

interface AddCounters1Props {
    onSuccess: (
        message: string,
        response: GetReadyType[],
        month: number,
        year: number
    ) => void;
    clientNit: string;
    Titulo?: string;
    Subtitulo?: string;
}

// --- Nombres de los meses para mostrar en la UI ---
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

export const Slider = ({
    onSuccess,
    clientNit,
    Titulo = "Registrar Contadores Pendientes",
    Subtitulo = "Seleccione un periodo para cargar los contadores",
}: AddCounters1Props) => {
    // --- Estados para guardar el año y mes seleccionados ---
    const currentYear = new Date().getFullYear();
    const [loading, setLoading] = useState(false);
    const currentMonth = new Date().getMonth() + 1;

    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth);

    const handleLoadCounters = async () => {
        setLoading(true);
        try {
            const response = await getReadyService(clientNit, year, month);
            if (response.status)
                onSuccess(
                    "Contadores cargados con éxito",
                    response.data,
                    month,
                    year
                );
            else toast.error(response.message || "Error al cargar contadores");
        } catch (e) {
            toast.error("Error al cargar contadores: " + (e as Error).message);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto bg-card rounded-xl p-8">
            {/* --- Encabezado --- */}
            <div className="mb-8 text-center">
                <div className="flex items-center justify-center mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <DollarSign className="w-6 h-6 text-primary" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-slate-800">{Titulo}</h2>
                <p className="text-sm text-slate-600">{Subtitulo}</p>
            </div>

            <div className="space-y-8">
                {/* --- Year --- */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <Clock className="w-4 h-4 text-primary" />
                        </div>
                        <label
                            htmlFor="year-slider"
                            className="text-sm font-semibold text-foreground"
                        >
                            Año
                        </label>
                    </div>

                    <div className="rounded-lg p-4 border border-border bg-blue-50">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs text-muted-foreground">
                                {currentYear - 20}
                            </span>
                            <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                                {year}
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {currentYear}
                            </span>
                        </div>
                        <input
                            id="year-slider"
                            type="range"
                            min={currentYear - 20}
                            max={currentYear}
                            value={year}
                            onChange={(e) =>
                                setYear(Number.parseInt(e.target.value))
                            }
                            className="w-full h-2 bg-border rounded-lg cursor-pointer slider-thumb transition-all duration-300 hover:scale-105"
                        />
                    </div>
                </div>

                {/* --- Month --- */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-secondary/10 p-2 rounded-lg">
                            <Calendar className="w-4 h-4 text-secondary" />
                        </div>
                        <label
                            htmlFor="month-slider"
                            className="text-sm font-semibold text-foreground"
                        >
                            Mes
                        </label>
                    </div>

                    <div className="rounded-lg p-4 border border-border bg-green-50">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs text-muted-foreground">
                                Ene
                            </span>
                            <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                                {monthNames[month - 1]}
                            </div>
                            <span className="text-xs text-muted-foreground">
                                Dic
                            </span>
                        </div>
                        <input
                            id="month-slider"
                            type="range"
                            min="1"
                            max="12"
                            value={month}
                            onChange={(e) =>
                                setMonth(Number.parseInt(e.target.value))
                            }
                            className="w-full h-2 bg-border rounded-lg cursor-pointer slider-thumb transition-all duration-300 hover:scale-105"
                        />
                    </div>
                </div>
            </div>

            {/* --- Información del periodo seleccionado --- */}
            <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
                <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="text-muted-foreground">
                        Periodo seleccionado:
                    </span>
                    <span className="font-semibold text-accent">
                        {monthNames[month - 1]} {year}
                    </span>
                </div>
            </div>

            {/* --- Botón de Acción --- */}
            <div className="mt-8">
                <Button
                    className="w-full bg-slate-800 hover:bg-slate-300 text-white hover:text-black font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    onClick={handleLoadCounters}
                    disabled={loading}
                >
                    <div className="flex items-center justify-center gap-2">
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                <span>Cargando...</span>
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                <span>Generar Factura</span>
                            </>
                        )}
                    </div>
                </Button>
            </div>
        </div>
    );
};
