"use client";
import React, { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { CreateContractForm } from "@/components/ui/CreateContractForm";
import { EditContractForm } from "@/components/ui/EditContractForm";
import { StatCard } from "@/components/ui/StatCard";
import { useDebounce } from "@/utilities/useDebounce";
import type { ContractType } from "@/types/contractType";
import { CreateContractsFromFile } from "@/components/ui/CreateContractFromFile";
import { CreateDetailsFromFile } from "@/components/ui/CreateDetailsFromFile";
import { useSearchParams } from "next/navigation";
import { Tooltip } from "@/components/ui/Tooltip";

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

    const formatNumber = (value: string): string => {
        return new Intl.NumberFormat("es-CO").format(Number(value));
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

    // * Search params
    useEffect(() => {
        const searchQuery = searchParams.get("search");

        if (searchQuery) {
            setSearchTerms((prevTerms) => ({
                ...prevTerms,
                query: searchQuery,
            }));
        }
    }, [searchParams]);

    // * Router
    const router = useRouter();
    const handleViewDetails = (clienteNit: string) => {
        router.push(`/contracts/${clienteNit}`);
    };

    // * Handle file upload success */
    const handleFileUploadSuccess = (message: string) => {
        toast.success(message);
        fetchContracts();
    };

    // * Handle file upload success */
    const handleFileDetailsUploadSuccess = (message: string) => {
        toast.success(message);
    };

    // * For searching contracts by Nit and Status
    useEffect(() => {
        const loadContracts = async () => {
            try {
                // Buscar por NIT y Estado
                if (debouncedSearchTerms.query && debouncedSearchTerms.status) {
                    setLoadingContracts(true);
                    const response = await searchCustomerByNitAndStatusService(
                        debouncedSearchTerms.query,
                        debouncedSearchTerms.status
                    );
                    console.log("Response from search:", response);
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

                // Buscar solo por NIT
                if (
                    debouncedSearchTerms.query &&
                    !debouncedSearchTerms.status
                ) {
                    setLoadingContracts(true);
                    const response = await searchCustomerByNITService(
                        debouncedSearchTerms.query
                    );
                    console.log("Response from search:", response);
                    if (response.status) {
                        setContracts(response.data);
                    } else {
                        setContracts([]);
                        toast.error("No se encontraron contratos para ese NIT");
                    }
                    setLoadingContracts(false);
                    return;
                }

                // Filtrar solo por estado (sin implementar búsqueda)
                if (
                    !debouncedSearchTerms.query &&
                    debouncedSearchTerms.status
                ) {
                    // Podrías implementar búsqueda por estado aquí si tienes el servicio
                    return;
                }

                // Cargar todos los contratos (inicial o cuando se limpia la búsqueda)
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

                        // Calcular estadísticas solo en carga inicial
                        if (loading) {
                            const activeCount = response.data.filter(
                                (contract) => contract.estado === "ACTIVO"
                            ).length;
                            const inactiveCount = response.data.filter(
                                (contract) => contract.estado === "INACTIVO"
                            ).length;
                            setActiveContracts(activeCount);
                            setInactiveContracts(inactiveCount);
                            setLoading(false);
                        }
                    } else {
                        setContracts([]);
                        // Solo mostrar error en carga inicial
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

    const fetchContracts = async () => {
        try {
            const response = await getContractsService();
            if (response.status) {
                setContracts(response.data);
                setLengthContracts(response.data?.length || 0);
                const activeCount = response.data.filter(
                    (contract) => contract.estado === "ACTIVO"
                ).length;
                const inactiveCount = response.data.filter(
                    (contract) => contract.estado === "INACTIVO"
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

    return (
        <div className="min-h-screen p-4 sm:p-8">
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
                </div>
            ) : (
                <div>
                    <div className="max-w-7xl mx-auto">
                        {/* Título y Botón de Nuevo Cliente */}
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

                        {/* Tarjetas de Estadísticas */}
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

                        {/* Sección de Filtros y Búsqueda */}
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

                            {/* Tabla de Clientes */}
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
                                                className="px-2 py-3 "
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
                                                className="px-2 py-3 "
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
                                                    className="px-2 py-4  text-slate-500"
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
                                                        className="px-2 py-4  text-slate-500"
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
                                                    {formatNumber(
                                                        contract.valorCanon
                                                    )}
                                                </td>
                                                <td className="px-2 py-4">
                                                    {formatNumber(
                                                        contract.valorBaseEquipo
                                                    )}
                                                </td>
                                                <td className="px-2 py-4">
                                                    {contract.periodo}
                                                </td>
                                                <td className="px-2 py-4 ">
                                                    <div>
                                                        {contract.fechaInicio}
                                                    </div>
                                                    <div>
                                                        {contract.fechaFin ||
                                                            "N/A"}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-xs ">
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
                                                                    <div className="text-[#fffff] font-semibold">
                                                                        {
                                                                            canon.grupo
                                                                        }
                                                                        :
                                                                    </div>
                                                                    <div className="text-slate-600 text-sm">
                                                                        {formatNumber(
                                                                            canon.valorCanon.toString()
                                                                        )}
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
                                                        <Tooltip text="Ver Detalles">
                                                            <button
                                                                className="border-[#8C9EC2] text-yellow-500 hover:bg-[#8C9EC2] p-2 hover:text-white font-semibold rounded-lg hover:cursor-pointer hover:transform hover:scale-105 transition-transform duration-200"
                                                                onClick={() =>
                                                                    handleViewDetails(
                                                                        contract.clienteNit
                                                                    )
                                                                }
                                                            >
                                                                <FiEye
                                                                    size={18}
                                                                />
                                                            </button>
                                                        </Tooltip>
                                                        <Tooltip text="Editar">
                                                            <button
                                                                className="border-[#8C9EC2] text-blue-500 hover:bg-[#8C9EC2] p-2 hover:text-white font-semibold rounded-lg hover:cursor-pointer hover:transform hover:scale-105 transition-transform duration-200"
                                                                onClick={() => {
                                                                    handleOpenModalEdit(
                                                                        contract
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
