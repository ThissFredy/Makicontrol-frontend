"use client";
import React, { useEffect } from "react";
import { getCustomers } from "@/api/customerApi";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
// import { StatusBadge } from "@/components/ui/StatusBadge"; // Se comenta porque CustomerType no tiene 'status'
import { CustomerType } from "@/types/customerType";
import {
    FiPlus,
    FiSearch,
    FiFilter,
    FiEye,
    FiEdit,
    FiTrash2,
} from "react-icons/fi";

const ClientManagementPage = () => {
    const [clients, setClients] = React.useState<CustomerType[]>();
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);
    const totalClients = clients ? clients.length : 0;

    useEffect(() => {
        const fetchClients = async () => {
            const response = await getCustomers();
            if (response.success) {
                setClients(response.data);
            } else {
                setError(response.message);
                setClients([]);
            }
            setLoading(false);
        };
        fetchClients();
    }, []);

    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* ! Cambiar loading y error */}
                Encabezado
                {loading && (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
                        <p>{error}</p>
                    </div>
                )}
                {/* Título y Botón de Nuevo Cliente */}
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">
                            Gestión de Clientes
                        </h1>
                        <p className="mt-1 text-slate-500">
                            Administra y organiza tu base de clientes
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <Button icon={<FiPlus size={20} />}>
                            Nuevo Cliente
                        </Button>
                    </div>
                </header>
                {/* Tarjetas de Estadísticas */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Total Clientes"
                        value={totalClients}
                        description="Clientes registrados"
                    />
                </section>
                {/* Sección de Filtros y Búsqueda */}
                <main className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">
                                Lista de Clientes
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">
                                Busca y filtra tus clientes
                            </p>
                        </div>
                        <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, correo o NIT..."
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="relative w-full sm:w-48">
                                <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select className="w-full appearance-none bg-white pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option>Todos</option>
                                    {/* Opciones de filtro relevantes */}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de Clientes */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-md text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Nombre
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Correo Electrónico
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Teléfono
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        NIT
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Dirección
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients?.length === 0 && (
                                    <tr className="bg-white border-b">
                                        <td
                                            colSpan={6}
                                            className="px-6 py-4 text-center text-slate-500"
                                        >
                                            No hay clientes registrados.
                                        </td>
                                    </tr>
                                )}
                                {clients?.map((client, index) => (
                                    <tr
                                        key={`${client.nit}-${index}`}
                                        className="bg-white border-b hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {client.nombre}
                                        </td>
                                        <td className="px-6 py-4 text-[#000000]">
                                            {client.correo}
                                        </td>
                                        <td className="px-6 py-4 text-[#000000]">
                                            {client.telefono}
                                        </td>
                                        <td className="px-6 py-4 text-[#000000]">
                                            {client.nit}
                                        </td>
                                        <td className="px-6 py-4 text-[#000000]">
                                            {client.direccion}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <button className="text-slate-500 hover:text-indigo-600">
                                                    <FiEye size={18} />
                                                </button>
                                                <button className="text-slate-500 hover:text-blue-600">
                                                    <FiEdit size={18} />
                                                </button>
                                                <button className="text-slate-500 hover:text-red-600">
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ClientManagementPage;
