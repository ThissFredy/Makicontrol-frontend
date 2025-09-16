"use client";
import React, { useEffect, useState, useRef } from "react";
// Importa ReactDOM para usar Portals
import ReactDOM from "react-dom";
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
import { TakeCounter } from "@/components/ui/TakeCounter";
import { SliderCheckout } from "@/components/ui/Checkout/SliderCheckout";
import { CustomerType } from "@/types/customerType";
import {
    FiPlus,
    FiSearch,
    FiEdit,
    FiFile,
    FiPrinter,
    FiMoreHorizontal,
    FiBook,
    FiDollarSign,
    FiDownload,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AssignPrintersFromFile } from "@/components/ui/AssignPrintersFromFile";
import { BsCash } from "react-icons/bs";
import { Modal2 } from "@/components/ui/Modal2";

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
    const [isModalTakeCounterOpen, setIsModalTakeCounterOpen] = useState(false);
    const [isModalDownloadReceiptOpen, setIsModalDownloadReceiptOpen] =
        useState(false);

    // State para el NIT del menú abierto
    const [openMenuNit, setOpenMenuNit] = useState<number | null>(null);
    const [counterUser, setCounterUser] = useState<string>("");

    // NUEVO: State para guardar el estilo de posición del menú (top, left)
    const [menuStyle, setMenuStyle] = useState({});

    const menuRef = useRef<HTMLDivElement | null>(null);
    const menuButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    // Ya no necesitamos la ref del contenedor de la tabla para el overflow
    // const tableContainerRef = useRef<HTMLDivElement | null>(null);

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

    const handleCloseCounterModal = () => setIsModalCounterOpen(false);
    const handleCloseTakeCounterModal = () => setIsModalTakeCounterOpen(false);

    const handleOpenDownloadReceiptModal = () =>
        setIsModalDownloadReceiptOpen(true);
    const handleCloseDownloadReceiptModal = () =>
        setIsModalDownloadReceiptOpen(false);

    const handleOpenPrintersFile = () => setIsModalPrintersFile(true);
    const handleClosePrintersFile = () => setIsModalPrintersFile(false);

    const handleOpenModalEdit = (client: CustomerType) => {
        setSelectedClient(client);
        setIsModalEditOpen(true);
    };

    const handleLookForTakeCounter = (nit: number) => {
        setIsModalTakeCounterOpen(true);
        setCounterUser(nit.toString());
    };

    const handleTakeCounterSuccess = (message: string) => {
        toast.success(message);
        fetchClients();
    };

    const handleDownloadReceiptSuccess = (message: string) => {
        toast.success(message);
        handleCloseDownloadReceiptModal();
    };

    const handleDownloadReceipt = (nit: number) => {
        handleOpenDownloadReceiptModal();
        setCounterUser(nit.toString());
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

    const handleViewPrinters = (nit: number) => {
        router.push(`/customers/${nit}`);
    };

    // Busqueda de clientes
    useEffect(() => {
        const loadClients = async () => {
            try {
                if (!debouncedSearchTerm) {
                    if (loading) {
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
                        const response = await getCustomers();
                        if (response.status) {
                            setClients(response.data.data);
                        }
                    }
                    return;
                }

                setLoadingClients(true);
                const response = await searchCustomerByNameOrNIT(
                    debouncedSearchTerm
                );

                if (response.status) {
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

    // Función para obtener todos los clientes
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

    // ** LÓGICA DEL MENÚ REFACTORIZADA **
    // Cierra el menú
    const closeMenu = () => setOpenMenuNit(null);

    // Abre/cierra el menú y calcula su posición
    // REEMPLAZA TODA LA FUNCIÓN handleToggleMenu CON ESTA VERSIÓN

    const handleToggleMenu = (nit: number, index: number) => {
        const button = menuButtonRefs.current[index];
        if (!button) return;

        if (openMenuNit === nit) {
            closeMenu();
        } else {
            const rect = button.getBoundingClientRect();
            // **LA CLAVE ESTÁ AQUÍ: Obtenemos la posición actual del scroll**
            const scrollY = window.scrollY;

            const menuWidth = 320;
            const menuHeight = 420;
            const margin = 8;

            const style: {
                top?: number;
                bottom?: number;
                left?: number;
                right?: number;
            } = {};

            // **Posicionamiento Vertical: Añadimos `scrollY` a los cálculos**
            if (rect.bottom + menuHeight > window.innerHeight) {
                // Abrir hacia arriba, relativo al documento
                style.top = rect.top + scrollY - menuHeight - margin;
            } else {
                // Abrir hacia abajo, relativo al documento
                style.top = rect.bottom + scrollY + margin;
            }

            // El posicionamiento horizontal no necesita cambios
            if (rect.left < margin) {
                style.left = margin;
            } else {
                style.left = rect.right - menuWidth;
            }

            setMenuStyle(style);
            setOpenMenuNit(nit);
        }
    };

    // useEffect para cerrar el menú si se hace clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                closeMenu();
            }
        };

        if (openMenuNit !== null) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openMenuNit]);

    // Buscamos el cliente activo para pasar sus datos al menú
    const activeClientForMenu = clients?.find(
        (client) => client.nit === openMenuNit
    );

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
                                    className="bg-slate-200 hover:bg-slate-300 text-slate-700"
                                >
                                    Agregar Plantilla de Impresoras
                                </Button>
                                <Button
                                    onClick={handleOpenModalFile}
                                    icon={<FiFile size={20} />}
                                    className="bg-slate-200 hover:bg-slate-300 text-slate-700"
                                >
                                    Agregar plantilla de clientes
                                </Button>
                                <Button
                                    onClick={handleOpenModal}
                                    icon={<FiPlus size={20} />}
                                    className="bg-[#E87A3E] hover:bg-[#D76B2D]"
                                >
                                    Nuevo Cliente
                                </Button>
                            </div>
                        </header>
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard
                                icon={<FiFile size={24} />}
                                title="Total Clientes"
                                value={totalClients}
                                description="Clientes registrados"
                            />
                        </section>
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

                            <div
                                // Ya no se necesita la ref aquí
                                className="overflow-x-auto rounded-lg"
                            >
                                <table className="w-full text-md text-left text-slate-500">
                                    <thead className="text-xs text-slate-700 uppercase bg-[#253763]">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-white"
                                            >
                                                Nombre / NIT
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-white"
                                            >
                                                Dirección
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-white"
                                            >
                                                Teléfono
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-white"
                                            >
                                                Correo Electrónico
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-white"
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
                                                    <div>{client.nombre}</div>
                                                    <div className="text-slate-700 font-normal">
                                                        {client.nit}
                                                    </div>
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
                                                    {/* El div relativo es para el botón, el menú ya no estará aquí */}
                                                    <div className="relative inline-block text-left">
                                                        <button
                                                            ref={(el) => {
                                                                menuButtonRefs.current[
                                                                    index
                                                                ] = el;
                                                            }}
                                                            onClick={() =>
                                                                handleToggleMenu(
                                                                    client.nit,
                                                                    index
                                                                )
                                                            } // Pasamos nit e index
                                                            className="p-2 rounded-full focus:outline-none"
                                                        >
                                                            <div className="border border-slate-300 hover:bg-slate-700 hover:transform hover:scale-120 hover:text-slate-100 transition-all duration-150 p-1.5 hover:cursor-pointer rounded-full shadow-md">
                                                                <FiMoreHorizontal
                                                                    size={20}
                                                                />
                                                            </div>
                                                        </button>
                                                        {/* El menú desplegable se ha movido fuera de la tabla a un Portal */}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </main>
                    </div>
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
                    <Modal2
                        isOpen={isModalCounterOpen}
                        onClose={handleCloseCounterModal}
                    >
                        <CreateCounter
                            onClose={handleCloseCounterModal}
                            onSuccess={handleCounterSuccess}
                            clienteNit={counterUser}
                        />
                    </Modal2>
                    <Modal2
                        isOpen={isModalTakeCounterOpen}
                        onClose={handleCloseTakeCounterModal}
                    >
                        <TakeCounter
                            onClose={handleCloseTakeCounterModal}
                            onSuccess={handleTakeCounterSuccess}
                            clienteNit={counterUser}
                        />
                    </Modal2>
                    <Modal2
                        isOpen={isModalDownloadReceiptOpen}
                        onClose={handleCloseDownloadReceiptModal}
                    >
                        <SliderCheckout
                            onSuccess={handleDownloadReceiptSuccess}
                            clientNit={counterUser}
                            Titulo="Facturación de Servicios"
                            Subtitulo="Seleccione un periodo para generar la factura"
                        />
                    </Modal2>
                </div>
            )}
            {/* * MENU FOR CLIENTE */}
            {/* Solo se renderiza si hay un menú abierto y un cliente seleccionado */}
            {openMenuNit &&
                activeClientForMenu &&
                ReactDOM.createPortal(
                    <div
                        ref={menuRef}
                        style={menuStyle}
                        className="absolute w-80 max-w-[95vw] rounded-md shadow-2xl bg-white z-50"
                    >
                        <div className="py-1" role="none">
                            <div className="w-full text-left px-4 py-2">
                                <div className="font-semibold text-slate-900">
                                    {activeClientForMenu.nombre}
                                </div>
                            </div>
                            <div className="overflow-hidden m-2">
                                <div className="h-0.5 w-full bg-gray-900"></div>
                            </div>

                            {/* Opciones del menú (usando <button> para accesibilidad) */}
                            <div className="m-3 hover:scale-105 hover:font-bold transition-all duration-150">
                                <button
                                    onClick={() => {
                                        handleLookForCounter(
                                            activeClientForMenu.nit
                                        );
                                        closeMenu();
                                    }}
                                    className="w-full text-slate-700 group flex items-center px-4 py-2 text-sm hover:cursor-pointer"
                                >
                                    <div className="bg-blue-100 rounded mr-3 p-2">
                                        <BsCash className="h-5 w-5 text-blue-700" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-left">
                                            Generar contador
                                        </div>
                                        <div className="text-xs text-slate-500 text-left">
                                            Crear nuevo reporte
                                        </div>
                                    </div>
                                </button>
                            </div>
                            <div className="m-3 hover:scale-105 hover:font-bold transition-all duration-150">
                                <button
                                    onClick={() => {
                                        handleViewPrinters(
                                            activeClientForMenu.nit
                                        );
                                        closeMenu();
                                    }}
                                    className="w-full text-slate-700 group flex items-center px-4 py-2 text-sm hover:cursor-pointer "
                                >
                                    <div className="bg-yellow-100 rounded mr-3 p-2">
                                        <FiPrinter className="h-5 w-5 text-yellow-700" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-left">
                                            Ver impresoras
                                        </div>
                                        <div className="text-xs text-slate-500 text-left">
                                            Lista de impresoras asociadas
                                        </div>
                                    </div>
                                </button>
                            </div>
                            <div className="m-3 hover:scale-105 hover:font-bold transition-all duration-150">
                                <button
                                    onClick={() => {
                                        handleLookForContract(
                                            activeClientForMenu.nit
                                        );
                                        closeMenu();
                                    }}
                                    className="w-full text-slate-700 group flex items-center px-4 py-2 text-sm hover:cursor-pointer "
                                >
                                    <div className="bg-green-100 rounded mr-3 p-2">
                                        <FiBook className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-left">
                                            Ver contrato
                                        </div>
                                        <div className="text-xs text-slate-500 text-left">
                                            Ver contrato asociado
                                        </div>
                                    </div>
                                </button>
                            </div>
                            <div className="m-3 hover:scale-105 hover:font-bold transition-all duration-150">
                                <button
                                    onClick={() => {
                                        handleOpenModalEdit(
                                            activeClientForMenu
                                        );
                                        closeMenu();
                                    }}
                                    className="w-full text-slate-700 group flex items-center px-4 py-2 text-sm hover:cursor-pointer "
                                >
                                    <div className="bg-purple-100 rounded mr-3 p-2">
                                        <FiEdit className="h-5 w-5 text-purple-700" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-left">
                                            Editar cliente
                                        </div>
                                        <div className="text-xs text-slate-500 text-left">
                                            Modificar datos del cliente
                                        </div>
                                    </div>
                                </button>
                            </div>
                            <div className="m-3 hover:scale-105 hover:font-bold transition-all duration-150">
                                <button
                                    onClick={() => {
                                        handleLookForTakeCounter(
                                            activeClientForMenu.nit
                                        );
                                        closeMenu();
                                    }}
                                    className="w-full text-slate-700 group flex items-center px-4 py-2 text-sm hover:cursor-pointer "
                                >
                                    <div className="bg-green-100 rounded mr-3 p-2">
                                        <FiDollarSign className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-left">
                                            Ver contadores
                                        </div>
                                        <div className="text-xs text-slate-500 text-left">
                                            Ver datos de los contadores
                                        </div>
                                    </div>
                                </button>
                            </div>
                            <div className="m-3 hover:scale-105 hover:font-bold transition-all duration-150">
                                <button
                                    onClick={() => {
                                        handleDownloadReceipt(
                                            activeClientForMenu.nit
                                        );
                                        closeMenu();
                                    }}
                                    className="w-full text-slate-700 group flex items-center px-4 py-2 text-sm hover:cursor-pointer "
                                >
                                    <div className="bg-red-100 rounded mr-3 p-2">
                                        <FiDownload className="h-5 w-5 text-red-700" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-left">
                                            Facturar
                                        </div>
                                        <div className="text-xs text-slate-500 text-left">
                                            Generar factura
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default ClientManagementPage;
