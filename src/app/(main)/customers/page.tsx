"use client";
import React, { useEffect, useState } from "react";
import { getCustomersService as getCustomers } from "@/services/customerService";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { CreateClientForm } from "@/components/ui/CreateClientForm";
import { CreateClientFromFile } from "@/components/ui/CreateClientFromFile";
import { EditClientForm } from "@/components/ui/EditClientForm";
import { StatCard } from "@/components/ui/StatCard";
import { useDebounce } from "@/utilities/useDebounce";
import { searchCustomerByNameOrNIT } from "@/services/customerService";
import { CreateCounter } from "@/components/ui/CreateCounter";
import { CustomerType } from "@/types/customerType";
import {
    FiPlus,
    FiSearch,
    FiEye,
    FiEdit,
    FiFile,
    FiPrinter,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Tooltip } from "@/components/ui/Tooltip";
import { AssignPrintersFromFile } from "@/components/ui/AssignPrintersFromFile";
import { BsCash } from "react-icons/bs";

const ClientManagementPage = () => {
    const router = useRouter();
    const [clients, setClients] = React.useState<CustomerType[]>();
    const [lengthClients, setLengthClients] = React.useState<number>(
        clients?.length || 0
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [isModalOpenFile, setIsModalOpenFile] = useState(false);
    const [isModalCounterOpen, setIsModalCounterOpen] = useState(false);
    const [counterUser, setCounterUser] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalPrintersFile, setIsModalPrintersFile] = useState(false);
    const [loadingClients, setLoadingClients] = React.useState<boolean>(false);
    const [selectedClient, setSelectedClient] = React.useState<CustomerType>({
        nombre: "",
        nit: 0,
        direccion: "",
        telefono: "",
        correo: "",
    });

    const [searchTerm, setSearchTerm] = React.useState<string>("");

    const totalClients = lengthClients || 0;

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleOpenModalFile = () => setIsModalOpenFile(true);
    const handleCloseModalFile = () => setIsModalOpenFile(false);

    const handleOpenCounterModal = () => setIsModalCounterOpen(true);
    const handleCloseCounterModal = () => setIsModalCounterOpen(false);

    const handleOpenPrintersFile = () => setIsModalPrintersFile(true);
    const handleClosePrintersFile = () => setIsModalPrintersFile(false);

    const handleOpenModalEdit = (client: CustomerType) => {
        setSelectedClient(client);
        setIsModalEditOpen(true);
    };
    const handleCloseModalEdit = () => {
        setIsModalEditOpen(false);
    };

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const handleCreationSuccess = (message: string, data: CustomerType) => {
        toast.success(message);
        setClients((prevClients) => [...(prevClients || []), data]);
    };

    const handleLookForContract = (nit: number) => {
        router.push(`/contracts?search=${nit}`);
    };

    const handleEditationSuccess = (message: string, data: CustomerType) => {
        toast.success(message);
        setClients((prevClients) => {
            if (!prevClients) return prevClients;

            return prevClients.map((client) =>
                client.nit === data.nit ? data : client
            );
        });
    };

    // * Looking for counters
    const handleLookForCounter = (nit: number) => {
        setIsModalCounterOpen(true);
        setCounterUser(nit.toString());
    };

    const handleCounterSuccess = (message: string) => {
        toast.success(message);
    };

    const handleFileUploadSuccess = (message: string) => {
        toast.success(message);
        fetchClients();
    };

    const handleFilePrintersUploadSuccess = (message: string) => {
        toast.success(message);
        fetchClients();
    };

    // * For relationate users and printers
    const handleViewPrinters = (nit: number) => {
        router.push(`/customers/${nit}`);
    };

    // * For searching clients by name or NIT
    useEffect(() => {
        const loadClients = async () => {
            try {
                // Si no hay término de búsqueda y es la primera carga
                if (!debouncedSearchTerm) {
                    if (loading) {
                        // Primera carga
                        const response = await getCustomers();
                        if (response.status) {
                            setClients(response.data.data);
                            setLengthClients(response.data.data?.length || 0);
                        } else {
                            toast.error(response.message);
                            setClients([]);
                        }
                        setLoading(false);
                    } else {
                        // Búsqueda vacía (regresar a mostrar todos)
                        const response = await getCustomers();
                        if (response.status) {
                            setClients(response.data.data);
                        }
                    }
                    return;
                }

                // Búsqueda con término
                setLoadingClients(true);
                const response = await searchCustomerByNameOrNIT(
                    debouncedSearchTerm
                );

                if (response.status) {
                    console.log("Clientes encontrados:", response);
                    setClients(response.data.data);
                } else {
                    toast.error("No se encontraron clientes");
                    setClients([]);
                }
            } catch (error) {
                console.error("Error loading clients:", error);
                toast.error("Error al cargar los clientes");
                setClients([]);
            } finally {
                setLoadingClients(false);
            }
        };

        loadClients();
    }, [debouncedSearchTerm, loading]);

    const fetchClients = async () => {
        try {
            const response = await getCustomers();
            if (response.status) {
                setClients(response.data.data);
                setLengthClients(response.data.data?.length || 0);
                return true;
            } else {
                setClients([]);
                return false;
            }
        } catch (error) {
            console.error("Error fetching clients:", error);
            setClients([]);
            return false;
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-8">
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
                </div>
            ) : (
                <div>
                    <div className="max-w-7xl mx-auto">
                        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800">
                                    Gestión de Clientes
                                </h1>
                                <p className="mt-1 text-slate-500">
                                    Administra y organiza tu base de clientes
                                </p>
                            </div>
                            <div className="block space-y-4 sm:space-y-0 sm:flex gap-4 mt-4 sm:mt-0">
                                <Button
                                    onClick={handleOpenPrintersFile}
                                    icon={<FiFile size={20} />}
                                    className="hover:cursor-pointer !bg-[#8C9EC2]"
                                >
                                    Agregar Plantilla de Impresoras
                                </Button>
                                <Button
                                    onClick={handleOpenModalFile}
                                    icon={<FiFile size={20} />}
                                    className="hover:cursor-pointer !bg-[#8C9EC2]"
                                >
                                    Agregar plantilla de clientes
                                </Button>
                                <Button
                                    onClick={handleOpenModal}
                                    icon={<FiPlus size={20} />}
                                    className="hover:cursor-pointer"
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
                                                Teléfono
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
                                                    {client.nit}
                                                </td>
                                                <td className="px-6 py-4 text-[#000000]">
                                                    {client.direccion}
                                                </td>
                                                <td className="px-6 py-4 text-[#000000]">
                                                    {client.telefono}
                                                </td>
                                                <td className="px-6 py-4 text-[#000000]">
                                                    {client.correo}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <Tooltip text="Generar Contador">
                                                            <button
                                                                className="text-slate-500 hover:text-[#E87A3E] hover:cursor-pointer"
                                                                onClick={() => {
                                                                    handleLookForCounter(
                                                                        client.nit
                                                                    );
                                                                }}
                                                            >
                                                                <BsCash
                                                                    size={18}
                                                                />
                                                            </button>
                                                        </Tooltip>
                                                        <Tooltip text="Ver Impresoras">
                                                            <button
                                                                className="text-slate-500 hover:text-[#E87A3E] hover:cursor-pointer"
                                                                onClick={() => {
                                                                    handleViewPrinters(
                                                                        client.nit
                                                                    );
                                                                }}
                                                            >
                                                                <FiPrinter
                                                                    size={18}
                                                                />
                                                            </button>
                                                        </Tooltip>
                                                        <Tooltip text="Ver Contrato">
                                                            <button
                                                                className="text-slate-500 hover:text-[#E87A3E] hover:cursor-pointer"
                                                                onClick={() => {
                                                                    handleLookForContract(
                                                                        client.nit
                                                                    );
                                                                }}
                                                            >
                                                                <FiEye
                                                                    size={18}
                                                                />
                                                            </button>
                                                        </Tooltip>
                                                        <Tooltip text="Editar">
                                                            <button
                                                                className="text-slate-500 hover:text-[#E87A3E] hover:cursor-pointer"
                                                                onClick={() => {
                                                                    handleOpenModalEdit(
                                                                        client
                                                                    );
                                                                }}
                                                            >
                                                                <FiEdit
                                                                    size={18}
                                                                />
                                                            </button>
                                                        </Tooltip>
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
                    <Modal
                        isOpen={isModalOpenFile}
                        onClose={handleCloseModalFile}
                    >
                        <CreateClientFromFile
                            onClose={handleCloseModalFile}
                            onSuccess={handleFileUploadSuccess}
                        />
                    </Modal>
                    <Modal
                        isOpen={isModalPrintersFile}
                        onClose={handleClosePrintersFile}
                    >
                        <AssignPrintersFromFile
                            onClose={handleClosePrintersFile}
                            onSuccess={handleFilePrintersUploadSuccess}
                        />
                    </Modal>
                    {/* 👇Modal for counters */}
                    <Modal
                        isOpen={isModalCounterOpen}
                        onClose={handleCloseCounterModal}
                    >
                        <CreateCounter
                            onClose={handleCloseCounterModal}
                            onSuccess={handleCounterSuccess}
                            clienteNit={counterUser}
                        />
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default ClientManagementPage;
