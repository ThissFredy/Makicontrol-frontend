"use client";
import React, { useEffect, useState, Suspense, useRef } from "react";
// 1. Importa ReactDOM para usar Portals
import ReactDOM from "react-dom";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { CreateContractForm } from "@/components/ui/CreateContractForm";
import { EditContractForm } from "@/components/ui/EditContractForm";
import { StatCard } from "@/components/ui/StatCard";
import { useDebounce } from "@/utilities/useDebounce";
import type { ContractType } from "@/types/contractType";
import { CreateContractsFromFile } from "@/components/ui/CreateContractFromFile";
import { CreateDetailsFromFile } from "@/components/ui/CreateDetailsFromFile";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { useSearchParams } from "next/navigation";
import {
    searchCustomerByNitAndStatusService,
    searchCustomerByNITService,
} from "@/services/contractService";
import { getContractsService } from "@/services/contractService";
import {
    FiPlus,
    FiSearch,
    FiEye,
    FiEdit,
    FiArrowDown,
    FiFile,
    FiCheck,
    FiMoreHorizontal,
    FiX,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const ContractsPage = () => {
    const [contracts, setContracts] = useState<ContractType[]>();
    const [lengthContracts, setLengthContracts] = useState<number>(
        contracts?.length || 0
    );
    const [activeContracts, setActiveContracts] = useState<number>(0);
    const [inactiveContracts, setInactiveContracts] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [isModalOpenFile, setIsModalOpenFile] = useState(false);
    const [isModalOpenDetailsFile, setIsModalOpenDetailsFile] = useState(false);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [loadingContracts, setLoadingContracts] = useState<boolean>(false);

    // 2. Estados actualizados para el menú
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [menuStyle, setMenuStyle] = useState({});
    const menuRef = useRef<HTMLDivElement | null>(null);
    const menuButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const [selectedContract, setSelectedContract] = useState<ContractType>({
        clienteNit: "",
        tipoContrato: "CANON_FIJO",
        valorCanon: "",
        valorBaseEquipo: "",
        periodo: "MENSUAL",
        fechaInicio: "",
        fechaFin: null,
        estado: "ACTIVO",
        canones: [],
    });
    const [searchTerms, setSearchTerms] = React.useState<{
        [key: string]: string;
    }>({});
    const totalContracts = lengthContracts || 0;
    const searchParams = useSearchParams();
    const router = useRouter();

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleOpenModalFile = () => setIsModalOpenFile(true);
    const handleCloseModalFile = () => setIsModalOpenFile(false);

    const handleOpenModalDetailsFile = () => setIsModalOpenDetailsFile(true);
    const handleCloseModalDetailsFile = () => setIsModalOpenDetailsFile(false);

    const handleOpenModalEdit = (contract: ContractType) => {
        setSelectedContract(contract);
        setIsModalEditOpen(true);
    };
    const handleCloseModalEdit = () => {
        setIsModalEditOpen(false);
    };

    const debouncedSearchTerms = useDebounce(searchTerms, 500);

    const handleCreationSuccess = (message: string, data: ContractType) => {
        toast.success(message);
        setContracts((prevContracts) => [...(prevContracts || []), data]);
    };

    const handleEditationSuccess = (message: string, data: ContractType) => {
        toast.success(message);
        setContracts((prevContracts) => {
            if (!prevContracts) return prevContracts;
            return prevContracts.map((contract) =>
                contract.clienteNit === data.clienteNit ? data : contract
            );
        });
    };

    useEffect(() => {
        const searchQuery = searchParams.get("search");
        if (searchQuery) {
            setSearchTerms((prevTerms) => ({
                ...prevTerms,
                query: searchQuery,
            }));
        }
    }, [searchParams]);

    const handleViewDetails = (clienteNit: string) => {
        router.push(`/contracts/${clienteNit}`);
    };

    const handleFileUploadSuccess = (message: string) => {
        toast.success(message);
        fetchContracts();
    };

    const handleFileDetailsUploadSuccess = (message: string) => {
        toast.success(message);
    };

    useEffect(() => {
        const loadContracts = async () => {
            try {
                if (debouncedSearchTerms.query && debouncedSearchTerms.status) {
                    setLoadingContracts(true);
                    const response = await searchCustomerByNitAndStatusService(
                        debouncedSearchTerms.query,
                        debouncedSearchTerms.status
                    );
                    if (response.status) {
                        setContracts(response.data);
                    } else {
                        setContracts([]);
                        toast.error(
                            "No se encontraron contratos con esos criterios"
                        );
                    }
                    setLoadingContracts(false);
                    return;
                }

                if (
                    debouncedSearchTerms.query &&
                    !debouncedSearchTerms.status
                ) {
                    setLoadingContracts(true);
                    const response = await searchCustomerByNITService(
                        debouncedSearchTerms.query
                    );
                    if (response.status) {
                        setContracts(response.data);
                    } else {
                        setContracts([]);
                        toast.error("No se encontraron contratos para ese NIT");
                    }
                    setLoadingContracts(false);
                    return;
                }

                if (
                    loading ||
                    (!debouncedSearchTerms.query &&
                        !debouncedSearchTerms.status)
                ) {
                    setLoadingContracts(true);
                    const response = await getContractsService();
                    if (response.status) {
                        setContracts(response.data);
                        setLengthContracts(response.data?.length || 0);
                        if (loading) {
                            const activeCount = response.data.filter(
                                (c) => c.estado === "ACTIVO"
                            ).length;
                            const inactiveCount = response.data.filter(
                                (c) => c.estado === "INACTIVO"
                            ).length;
                            setActiveContracts(activeCount);
                            setInactiveContracts(inactiveCount);
                            setLoading(false);
                        }
                    } else {
                        setContracts([]);
                        if (loading) {
                            toast.error(response.message);
                            setLoading(false);
                        }
                    }
                    setLoadingContracts(false);
                }
            } catch (error) {
                console.error("Error loading contracts:", error);
                setContracts([]);
                if (loading) {
                    toast.error("Error al cargar los contratos");
                    setLoading(false);
                }
                setLoadingContracts(false);
            }
        };
        loadContracts();
    }, [debouncedSearchTerms, loading]);

    // 3. Nuevas funciones para manejar el menú
    const closeMenu = () => setOpenMenuId(null);

    const handleToggleMenu = (clienteNit: string, index: number) => {
        const button = menuButtonRefs.current[index];
        if (!button) return;

        if (openMenuId === clienteNit) {
            closeMenu();
        } else {
            const rect = button.getBoundingClientRect();
            const scrollY = window.scrollY;

            const menuWidth = 320;
            const menuHeight = 220; // Altura ajustada para 2 opciones
            const margin = 8;

            const style: { top?: number; left?: number } = {};

            if (rect.bottom + menuHeight > window.innerHeight) {
                style.top = rect.top + scrollY - menuHeight - margin;
            } else {
                style.top = rect.bottom + scrollY + margin;
            }

            const buttonCenter = rect.left + rect.width / 2;
            let leftPosition = buttonCenter - menuWidth / 2;

            if (leftPosition < margin) {
                leftPosition = margin;
            }
            if (leftPosition + menuWidth > window.innerWidth) {
                leftPosition = window.innerWidth - menuWidth - margin;
            }
            style.left = leftPosition;

            setMenuStyle(style);
            setOpenMenuId(clienteNit);
        }
    };

    // 4. useEffect simplificado para cerrar el menú
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                closeMenu();
            }
        };

        if (openMenuId !== null) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openMenuId]);

    const fetchContracts = async () => {
        try {
            const response = await getContractsService();
            if (response.status) {
                setContracts(response.data);
                setLengthContracts(response.data?.length || 0);
                const activeCount = response.data.filter(
                    (c) => c.estado === "ACTIVO"
                ).length;
                const inactiveCount = response.data.filter(
                    (c) => c.estado === "INACTIVO"
                ).length;
                setActiveContracts(activeCount);
                setInactiveContracts(inactiveCount);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error fetching contracts:", error);
            return false;
        }
    };

    const activeContractForMenu = contracts?.find(
        (c) => c.clienteNit === openMenuId
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
                                    Gestión de Contratos
                                </h1>
                                <p className="mt-1 text-slate-500">
                                    Administra y organiza tu base de contratos
                                </p>
                            </div>
                            <div className="flex gap-4 mt-4 sm:mt-0 flex-wrap">
                                <Button
                                    onClick={handleOpenModalFile}
                                    icon={<FiFile size={20} />}
                                    className="bg-slate-200 hover:bg-slate-300 text-slate-700"
                                >
                                    Agregar archivo de contratos
                                </Button>
                                <Button
                                    onClick={handleOpenModalDetailsFile}
                                    icon={<FiFile size={20} />}
                                    className="bg-slate-200 hover:bg-slate-300 text-slate-700"
                                >
                                    Agregar archivo detalles de contratos
                                </Button>
                                <Button
                                    onClick={handleOpenModal}
                                    icon={<FiPlus size={20} />}
                                    className="bg-[#E87A3E] hover:bg-[#D76B2D]"
                                >
                                    Nuevo Contrato
                                </Button>
                            </div>
                        </header>

                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard
                                icon={<FiFile size={24} />}
                                title="Total Contratos"
                                value={totalContracts}
                                description="Contratos registrados"
                                color="text-[#1A2541] "
                            />
                            <StatCard
                                icon={<FiCheck size={24} />}
                                title="Contratos Activos"
                                value={activeContracts}
                                description="Contratos en estado activo"
                                color="text-green-600"
                            />
                            <StatCard
                                icon={<FiX size={24} />}
                                title="Contratos Inactivos"
                                value={inactiveContracts}
                                description="Contratos en estado inactivo"
                                color="text-red-500"
                            />
                        </section>

                        <main className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">
                                        Lista de Contratos
                                    </h2>
                                    <p className="text-slate-500 text-sm mt-1">
                                        Busca y filtra tus contratos
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 mt-4 sm:mt-0 w-full md:w-auto border border-slate-200 p-3 rounded-lg">
                                    <div className="relative w-full sm:w-100">
                                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar por NIT y Estado"
                                            value={searchTerms["query"] || ""}
                                            onChange={(e) =>
                                                setSearchTerms({
                                                    ...searchTerms,
                                                    query: e.target.value,
                                                })
                                            }
                                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div className="relative w-full sm:w-60 gap-2 flex items-center">
                                        <FiArrowDown className="text-slate-400" />
                                        <select
                                            value={searchTerms["status"] || ""}
                                            onChange={(e) =>
                                                setSearchTerms({
                                                    ...searchTerms,
                                                    status: e.target.value,
                                                })
                                            }
                                            className="w-full pl-4 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                                        >
                                            <option value="">
                                                Selecciona un estado
                                            </option>
                                            <option value="ACTIVO">
                                                Activo
                                            </option>
                                            <option value="INACTIVO">
                                                Inactivo
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-lg">
                                <table className="w-full text-md text-center text-slate-500">
                                    <thead className="text-xs text-white uppercase bg-[#253763]">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-2 py-3"
                                            >
                                                <div>NIT</div>
                                                <div>Tipo de Contrato</div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-2 py-3"
                                            >
                                                Valor Canon
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-2 py-3"
                                            >
                                                Valor Base Equipo
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-2 py-3"
                                            >
                                                Periodo
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-2 py-3"
                                            >
                                                Inicio / Fin
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-2 py-3"
                                            >
                                                Estado
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-2 py-3"
                                            >
                                                Canones
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-2 py-3"
                                            >
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loadingContracts ? (
                                            <tr className="bg-white border-b">
                                                <td
                                                    colSpan={10}
                                                    className="px-2 py-4 text-slate-500"
                                                >
                                                    <div className="flex items-center justify-center h-64">
                                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            contracts?.length === 0 && (
                                                <tr className="bg-white border-b">
                                                    <td
                                                        colSpan={10}
                                                        className="px-2 py-4 text-slate-500"
                                                    >
                                                        No hay contratos
                                                        registrados.
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                        {contracts?.map((contract, index) => (
                                            <tr
                                                key={`${contract.clienteNit}-${index}`}
                                                className="bg-white border-b text-sm hover:bg-slate-50 text-[#000000]"
                                            >
                                                <td className="px-2 py-4 font-medium">
                                                    <div className="text-lg">
                                                        {contract.clienteNit}
                                                    </div>
                                                    <div className="text-gray-500 font-normal">
                                                        {contract.tipoContrato}
                                                    </div>
                                                </td>
                                                <td className="px-2 py-4">
                                                    <CurrencyInput
                                                        id="valorCanon"
                                                        name="valorCanon"
                                                        value={
                                                            contract.valorCanon
                                                        }
                                                        input={false}
                                                    />
                                                </td>
                                                <td className="px-2 py-4">
                                                    <CurrencyInput
                                                        id="valorBase"
                                                        name="valorBase"
                                                        value={
                                                            contract.valorBaseEquipo
                                                        }
                                                        input={false}
                                                    />
                                                </td>
                                                <td className="px-2 py-4">
                                                    {contract.periodo}
                                                </td>
                                                <td className="px-2 py-4">
                                                    <div>
                                                        {contract.fechaInicio}
                                                    </div>
                                                    <div>
                                                        {contract.fechaFin ||
                                                            "N/A"}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-xs">
                                                    {contract.estado ===
                                                    "ACTIVO" ? (
                                                        <span className="text-green-800 bg-green-100 font-semibold border border-green-500 px-2 py-1 rounded-xl">
                                                            {contract.estado}
                                                        </span>
                                                    ) : (
                                                        <span className="text-red-800 bg-red-100 font-semibold border border-red-500 px-2 py-1 rounded-xl">
                                                            INACTIVO
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-2 py-4 justify-center">
                                                    {contract.canones.length >
                                                    0 ? (
                                                        contract.canones.map(
                                                            (canon) => (
                                                                <div
                                                                    key={
                                                                        canon.grupo
                                                                    }
                                                                    className="flex justify-center gap-2"
                                                                >
                                                                    <div className="text-[#000000] font-semibold">
                                                                        {
                                                                            canon.grupo
                                                                        }
                                                                        :
                                                                    </div>
                                                                    <div className="text-slate-600 text-sm">
                                                                        <CurrencyInput
                                                                            input={
                                                                                false
                                                                            }
                                                                            value={
                                                                                canon.valorCanon
                                                                            }
                                                                            id={`canon-${canon.grupo}`}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )
                                                        )
                                                    ) : (
                                                        <div className="text-gray-400">
                                                            No Aplica
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-2 py-4 justify-center">
                                                    <div className="flex justify-center">
                                                        <div className="relative inline-block text-left">
                                                            {/* 5. onClick actualizado y menú en línea eliminado */}
                                                            <button
                                                                ref={(el) => {
                                                                    menuButtonRefs.current[
                                                                        index
                                                                    ] = el;
                                                                }}
                                                                onClick={() =>
                                                                    handleToggleMenu(
                                                                        contract.clienteNit,
                                                                        index
                                                                    )
                                                                }
                                                                className="p-2 rounded-full focus:outline-none"
                                                            >
                                                                <div className="border border-slate-300 hover:bg-slate-700 hover:transform hover:scale-120 hover:text-slate-100 transition-all duration-150 p-1.5 hover:cursor-pointer rounded-full shadow-md">
                                                                    <FiMoreHorizontal
                                                                        size={
                                                                            20
                                                                        }
                                                                    />
                                                                </div>
                                                            </button>
                                                        </div>
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
                        <CreateContractForm
                            onClose={handleCloseModal}
                            onSuccess={handleCreationSuccess}
                        />
                    </Modal>
                    <Modal
                        isOpen={isModalEditOpen}
                        onClose={handleCloseModalEdit}
                    >
                        <EditContractForm
                            onClose={handleCloseModalEdit}
                            onSuccess={handleEditationSuccess}
                            initialData={selectedContract}
                        />
                    </Modal>
                    <Modal
                        isOpen={isModalOpenFile}
                        onClose={handleCloseModalFile}
                    >
                        <CreateContractsFromFile
                            onClose={handleCloseModalFile}
                            onSuccess={handleFileUploadSuccess}
                        />
                    </Modal>
                    <Modal
                        isOpen={isModalOpenDetailsFile}
                        onClose={handleCloseModalDetailsFile}
                    >
                        <CreateDetailsFromFile
                            onClose={handleCloseModalDetailsFile}
                            onSuccess={handleFileDetailsUploadSuccess}
                        />
                    </Modal>
                </div>
            )}

            {/* 5. Portal para el menú desplegable */}
            {openMenuId &&
                activeContractForMenu &&
                ReactDOM.createPortal(
                    <div
                        ref={menuRef}
                        style={menuStyle}
                        className="absolute w-80 max-w-[95vw] rounded-md shadow-2xl bg-white z-50"
                    >
                        <div className="py-1" role="none">
                            <div className="w-full text-left px-4 py-2">
                                <div className="font-semibold text-slate-900">
                                    Contrato: {activeContractForMenu.clienteNit}
                                </div>
                            </div>
                            <div className="overflow-hidden m-2">
                                <div className="h-0.5 w-full bg-gray-900"></div>
                            </div>
                            <div className="m-3 hover:scale-105 hover:font-bold transition-all duration-150">
                                <button
                                    onClick={() => {
                                        handleViewDetails(
                                            activeContractForMenu.clienteNit
                                        );
                                        closeMenu();
                                    }}
                                    className="w-full text-slate-700 group flex items-center px-4 py-2 text-sm hover:cursor-pointer"
                                >
                                    <div className="bg-yellow-100 rounded mr-3 p-2">
                                        <FiEye className="h-5 w-5 text-yellow-700" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-left">
                                            Ver Detalles
                                        </div>
                                        <div className="text-xs text-slate-500 text-left">
                                            Inspeccionar detalles del contrato
                                        </div>
                                    </div>
                                </button>
                            </div>

                            <div className="m-3 hover:scale-105 hover:font-bold transition-all duration-150">
                                <button
                                    onClick={() => {
                                        handleOpenModalEdit(
                                            activeContractForMenu
                                        );
                                        closeMenu();
                                    }}
                                    className="w-full text-slate-700 group flex items-center px-4 py-2 text-sm hover:cursor-pointer"
                                >
                                    <div className="bg-purple-100 rounded mr-3 p-2">
                                        <FiEdit className="h-5 w-5 text-purple-700" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-left">
                                            Editar Contrato
                                        </div>
                                        <div className="text-xs text-slate-500 text-left">
                                            Modificar datos del contrato
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

const Contracts = () => {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
                </div>
            }
        >
            <ContractsPage />
        </Suspense>
    );
};

export default Contracts;
