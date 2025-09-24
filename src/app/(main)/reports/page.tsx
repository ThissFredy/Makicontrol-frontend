"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    type ChartData,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { useRouter } from "next/navigation";
// Emojis
import { StatCard } from "@/components/ui/StatCard";
import { FiCopy, FiDollarSign, FiSearch } from "react-icons/fi";
import { Clock } from "lucide-react";
import { BsFilePerson } from "react-icons/bs";
import { toast } from "react-hot-toast";
import type { ReportType } from "@/types/reportType";

// Service
import { getReportData } from "@/services/reportService";

// Components
import { StatusBadgeReports } from "@/components/ui/StatusBadge";
import { Tooltip as Tooltype } from "@/components/ui/Tooltip";

// Chart Components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Reports = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<ReportType | null>(null);
    const [availableYears, setAvailableYears] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("Todos");
    const [selectedYear, setSelectedYear] = useState<number>(
        new Date().getFullYear()
    );
    const router = useRouter();

    // Data for Charts
    const [barChartData, setBarChartData] = useState<ChartData<"bar">>({
        datasets: [],
    });
    const [doughnutChartData, setDoughnutChartData] = useState<
        ChartData<"doughnut">
    >({
        datasets: [],
    });

    // LOAD INITIAL DATA
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const response = await getReportData();
                if (!response.data) {
                    console.error(
                        "Error fetching report data:",
                        response.message
                    );
                    toast.error("Error al obtener los datos del reporte");
                    return;
                }
                setData(response.data);
                const responsedata = response.data;

                // Extract available years from the data (UNIQUE)
                const years = [
                    ...new Set(
                        responsedata.totalFacturado.map((item) => item.ano)
                    ),
                ].sort((a, b) => b - a);
                setAvailableYears(years);
                console.log("AVAILABLE YEARS:", years);

                // Set the selected year to the most recent year
                if (years.length > 0) {
                    setSelectedYear(years[0]);
                }
            } catch (error) {
                console.error("Error fetching report data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Use effecto for updating chart data when `data` or `selectedYear` changes
    useEffect(() => {
        if (!data) return;

        // Logic for bar chart data
        const monthlyTotals = Array(12).fill(0);
        data.totalFacturado
            .filter((item) => item.ano === selectedYear)
            .forEach((item) => {
                monthlyTotals[item.mes - 1] = item.total;
            });

        setBarChartData({
            labels: [
                "Ene",
                "Feb",
                "Mar",
                "Abr",
                "May",
                "Jun",
                "Jul",
                "Ago",
                "Sep",
                "Oct",
                "Nov",
                "Dic",
            ],
            datasets: [
                {
                    label: `Facturación ${selectedYear}`,
                    data: monthlyTotals,
                    backgroundColor: "#1A2541",
                    borderRadius: 5,
                },
            ],
        });

        // Logic for doughnut chart data

        const clientStatusCounts = data.clientes.reduce(
            (acc, cliente) => {
                const key =
                    cliente.estadoFacturado.toLocaleLowerCase() as keyof typeof acc;
                acc[key] = (acc[key] || 0) + 1;
                return acc;
            },
            { facturado: 0, pendiente: 0, vencido: 0 }
        );

        setDoughnutChartData({
            labels: ["Facturados", "Pendientes", "Vencidos"],
            datasets: [
                {
                    data: [
                        clientStatusCounts.facturado,
                        clientStatusCounts.pendiente,
                        clientStatusCounts.vencido,
                    ],
                    backgroundColor: ["#16a34a", "#f97316", "#dc2626"],
                    borderColor: ["#ffffff"],
                    borderWidth: 2,
                },
            ],
        });
    }, [data, selectedYear]);

    // DOUGHNUT OPTIONS
    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (tickValue: string | number) {
                        const value =
                            typeof tickValue === "number"
                                ? tickValue
                                : Number(tickValue);
                        return `$${value / 1000000}M COP`;
                    },
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    // Client Filter
    const filteredClients = useMemo(() => {
        if (!data) return [];
        return data.clientes
            .filter((cliente) => {
                if (statusFilter === "Todos") return true;
                return cliente.estadoFacturado === statusFilter;
            })
            .filter((Cliente) => {
                return Cliente.clienteNit
                    .toLocaleLowerCase()
                    .includes(searchTerm.toLocaleLowerCase());
            });
    }, [data, searchTerm, statusFilter]);

    // * HANDLERS
    // Change year handler
    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(Number(e.target.value));
    };

    console.log("DATA:", data);
    console.log("BAR DATA:", barChartData);
    console.log("DOUGHNUT DATA:", doughnutChartData);
    console.log("AVAILABLE YEARS:", availableYears);

    // Copy to clipboard function
    // TODO: When click, go to customer detail page
    const handleCopyNit = (nit: string) => {
        navigator.clipboard.writeText(nit);
        router.push(`/customers?search=${nit}`);
    };

    return (
        <div className="min-h-screen p-4 sm:p-8 bg-slate-50">
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    {/* HEADER */}
                    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">
                                Gestión de Clientes
                            </h1>
                            <p className="mt-1 text-slate-500">
                                Administra y organiza tu base de clientes
                            </p>
                        </div>
                    </header>

                    {/* --- CARDS --- */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard
                            icon={<FiDollarSign />}
                            title="Total Facturado"
                            value={2540.75}
                            description="Total facturado en el mes actual"
                            color="text-green-600"
                        />
                        <StatCard
                            icon={<BsFilePerson />}
                            title="Clientes Facturados"
                            value={54}
                            description="Número de clientes facturados este mes"
                            color="text-blue-600"
                        />
                        <StatCard
                            icon={<Clock />}
                            title="Clientes Pendientes"
                            value={54}
                            description="Clientes pendientes de facturación"
                            color="text-orange-400"
                        />
                    </section>

                    {/* --- PLOTS --- */}
                    <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Gráfica de Barras */}
                        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-slate-800">
                                    Facturación Mensual 2024
                                </h2>
                                <select
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                    className="text-sm text-slate-600 border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {availableYears.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="h-72">
                                {" "}
                                <Bar options={barOptions} data={barChartData} />
                            </div>
                        </div>

                        {/* DOUGHNUT CHART*/}
                        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">
                                Estado de Clientes
                            </h2>
                            <div className="h-48 flex justify-center items-center">
                                <Doughnut
                                    options={doughnutOptions}
                                    data={doughnutChartData}
                                />
                            </div>
                            <div className="mt-4 space-y-2">
                                {(
                                    doughnutChartData.labels as
                                        | string[]
                                        | undefined
                                )?.map((label, index) => {
                                    // Safely access datasets[0]
                                    const dataset =
                                        doughnutChartData.datasets?.[0];
                                    // Safely access backgroundColor and data arrays
                                    const bgColors = Array.isArray(
                                        dataset?.backgroundColor
                                    )
                                        ? dataset.backgroundColor
                                        : [];
                                    const dataArr = Array.isArray(dataset?.data)
                                        ? dataset.data
                                        : [];
                                    return (
                                        <div
                                            key={label}
                                            className="flex items-center justify-between text-sm"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="w-3 h-3 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            bgColors[index] ??
                                                            "#ccc",
                                                    }}
                                                ></span>
                                                <span className="text-slate-600">
                                                    {label}
                                                </span>
                                            </div>
                                            <span className="font-medium text-slate-800">
                                                {dataArr[index] ?? 0}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                    <section className="bg-white p-6 rounded-lg shadow-sm mt-8">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">
                            Estado de Facturación por Cliente
                        </h2>
                        {/* Controles de Búsqueda y Filtrado */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-4">
                            <div className="relative flex-grow">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por NIT..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Todos">Todos los estados</option>
                                <option value="Facturado">Facturado</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Vencido">Vencido</option>
                            </select>
                        </div>

                        {/* Tabla de Clientes */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-500">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Cliente (NIT)
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Estado
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-center"
                                        >
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClients.map((client) => (
                                        <tr
                                            key={client.clienteNit}
                                            className="bg-white border-b hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {client.clienteNit}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadgeReports
                                                    status={
                                                        client.estadoFacturado ===
                                                        "Facturado"
                                                            ? "Facturado"
                                                            : client.estadoFacturado ===
                                                              "Vencido"
                                                            ? "Vencido"
                                                            : "Pendiente"
                                                    }
                                                />
                                            </td>
                                            <td className="px-6 py-4 flex items-center justify-center gap-2">
                                                <Tooltype text="Buscar cliente">
                                                    <button
                                                        onClick={() =>
                                                            handleCopyNit(
                                                                client.clienteNit
                                                            )
                                                        }
                                                        className="p-2 text-slate-500 hover:bg-slate-200 hover:cursor-pointer rounded-full transform hover:scale-110 transition-transform"
                                                        title="Copiar NIT"
                                                    >
                                                        <FiCopy />
                                                    </button>
                                                </Tooltype>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredClients.length === 0 && (
                                <p className="text-center py-8 text-slate-500">
                                    No se encontraron clientes que coincidan con
                                    los filtros.
                                </p>
                            )}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

export default Reports;
