"use client";
import React, { useEffect, useState } from "react";
import { getCustomers } from "@/api/customerApi";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { CreateClientForm } from "@/components/ui/CreateClientForm";
import { EditClientForm } from "@/components/ui/EditClientForm";
import { StatCard } from "@/components/ui/StatCard";
import { useDebounce } from "@/utilities/useDebounce";
import { searchCustomerByNameOrNIT } from "@/services/customerService";
import { CustomerType } from "@/types/customerType";
import { FiPlus, FiSearch, FiEye, FiEdit } from "react-icons/fi";

const ClientManagementPage = () => {
    const [clients, setClients] = React.useState<CustomerType[]>();
    const [lengthClients, setLengthClients] = React.useState<number>(
        clients?.length || 0
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [loadingClients, setLoadingClients] = React.useState<boolean>(false);
    const [selectedClient, setSelectedClient] = React.useState<CustomerType>({
        nombre: "",
        nit: 0,
        direccion: "",
        telefono: "",
        correo: "",
    });
    const [error, setError] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState<string>("");
    const [successMessage, setSuccessMessage] = React.useState<string | null>(
        null
    );
    const totalClients = lengthClients || 0;

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleOpenModalEdit = (client: CustomerType) => {
        setSelectedClient(client);
        setIsModalEditOpen(true);
    };
    const handleCloseModalEdit = () => {
        setIsModalEditOpen(false);
    };

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const handleCreationSuccess = (message: string, data: CustomerType) => {
        setSuccessMessage(message);
        setClients((prevClients) => [...(prevClients || []), data]);
    };

    const handleEditationSuccess = (message: string, data: CustomerType) => {
        setSuccessMessage(message);
        setClients((prevClients) => {
            if (!prevClients) return prevClients;

            return prevClients.map((client) =>
                client.nit === data.nit ? data : client
            );
        });
    };

    // * For searching clients by name or NIT
    useEffect(() => {
        const searchClients = async () => {
            if (!debouncedSearchTerm) {
                const response = await getCustomers();
                if (response.success) setClients(response.data);
                return;
            }

            setLoadingClients(true);
            const response = await searchCustomerByNameOrNIT(
                debouncedSearchTerm
            );

            if (response.status) {
                console.log("Clientes encontrados:", response);
                setClients(response.data.data);
                setError(null);
            } else {
                setClients([]);
            }
            setLoadingClients(false);
        };

        searchClients();
    }, [debouncedSearchTerm]);

    useEffect(() => {
        const fetchClients = async () => {
            const response = await getCustomers();
            if (response.success) {
                setClients(response.data);
                setLengthClients(response.data ? response.data.length : 0);
            } else {
                setError(response.message);
                setClients([]);
            }
            setLoading(false);
        };
        fetchClients();
    }, []);

    return (
        <div className="min-h-screen p-4 sm:p-8">
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
                </div>
            ) : (
                <div>
                    <div className="max-w-7xl mx-auto">
                        {error && (
                            <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
                                <p>{error}</p>
                            </div>
                        )}
                        {successMessage && (
                            <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">
                                <p>{successMessage}</p>
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
                                <Button
                                    onClick={handleOpenModal}
                                    icon={<FiPlus size={20} />}
                                >
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
                                    <div className="relative w-full sm:w-100">
                                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar por nombre o NIT..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Tabla de Clientes */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-md text-left text-slate-500">
                                    <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Nombre
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Correo Electrónico
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Teléfono
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                NIT
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Dirección
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loadingClients ? (
                                            <tr className="bg-white border-b">
                                                <td
                                                    colSpan={6}
                                                    className="px-6 py-4 text-center text-slate-500"
                                                >
                                                    <div className="flex items-center justify-center h-64">
                                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            clients?.length === 0 && (
                                                <tr className="bg-white border-b">
                                                    <td
                                                        colSpan={6}
                                                        className="px-6 py-4 text-center text-slate-500"
                                                    >
                                                        No hay clientes
                                                        registrados.
                                                    </td>
                                                </tr>
                                            )
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
                                                        <button
                                                            className="text-slate-500 hover:text-blue-600"
                                                            onClick={() => {
                                                                handleOpenModalEdit(
                                                                    client
                                                                );
                                                            }}
                                                        >
                                                            <FiEdit size={18} />
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
                    {/* 👇 Renderiza el Modal aquí, fuera del flujo principal */}
                    <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                        <CreateClientForm
                            onClose={handleCloseModal}
                            onSuccess={handleCreationSuccess}
                        />
                    </Modal>
                    <Modal
                        isOpen={isModalEditOpen}
                        onClose={handleCloseModalEdit}
                    >
                        <EditClientForm
                            onClose={handleCloseModalEdit}
                            onSuccess={handleEditationSuccess}
                            initialData={selectedClient}
                        />
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default ClientManagementPage;
