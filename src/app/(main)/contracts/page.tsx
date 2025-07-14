"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { CreateContractForm } from "@/components/ui/CreateContractForm";
import { EditContractForm } from "@/components/ui/EditContractForm";
import { StatCard } from "@/components/ui/StatCard";
import { useDebounce } from "@/utilities/useDebounce";
import type { ContractType } from "@/types/contractType";
import { CreateContractsFromFile } from "@/components/ui/CreateContractFromFile";

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
} from "react-icons/fi";
import { toast } from "react-hot-toast";

const Contracts = () => {
    const [contracts, setContracts] = React.useState<ContractType[]>();
    const [lengthContracts, setLengthContracts] = React.useState<number>(
        contracts?.length || 0
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [isModalOpenFile, setIsModalOpenFile] = useState(false);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [loadingContracts, setLoadingContracts] =
        React.useState<boolean>(false);
    const [selectedContract, setSelectedContract] =
        React.useState<ContractType>({
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

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleOpenModalFile = () => setIsModalOpenFile(true);
    const handleCloseModalFile = () => setIsModalOpenFile(false);

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

    // * Handle file upload success */
    const handleFileUploadSuccess = (message: string) => {
        toast.success(message);
        fetchContracts();
    };

    // * For searching contracts by Nit and Status
    useEffect(() => {
        const searchContracts = async () => {
            if (debouncedSearchTerms.query && debouncedSearchTerms.status) {
                setLoadingContracts(true);
                const response = await searchCustomerByNitAndStatusService(
                    debouncedSearchTerms.query,
                    debouncedSearchTerms.status
                );
                console.log("Response from search:", response);
                if (response.status) setContracts(response.data);
                else setContracts([]);
                setLoadingContracts(false);
                return;
            } else if (
                debouncedSearchTerms.query &&
                !debouncedSearchTerms.status
            ) {
                setLoadingContracts(true);
                const response = await searchCustomerByNITService(
                    debouncedSearchTerms.query
                );
                console.log("Response from search:", response);
                if (response.status) setContracts(response.data);
                else setContracts([]);
                setLoadingContracts(false);
                return;
            } else if (
                !debouncedSearchTerms.query &&
                debouncedSearchTerms.status
            ) {
                return;
            }
            setLoadingContracts(true);
            const response = await getContractsService();
            if (response.status) {
                setContracts(response.data);
                setLengthContracts(
                    response.data && response.data.length
                        ? response.data.length
                        : 0
                );
            } else {
                toast.error(response.message);
                setContracts([]);
            }
            setLoadingContracts(false);
        };

        searchContracts();
    }, [debouncedSearchTerms]);

    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        const response = await getContractsService();
        if (response.status) {
            setContracts(response.data);
            setLengthContracts(
                response.data && response.data.length ? response.data.length : 0
            );
        } else {
            toast.error(response.message);
            setContracts([]);
        }
        setLoading(false);
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
                            <div className="flex gap-4 mt-4 sm:mt-0">
                                <Button
                                    onClick={handleOpenModalFile}
                                    icon={<FiFile size={20} />}
                                    className="hover:cursor-pointer"
                                >
                                    Agregar plantilla de contratos
                                </Button>
                                <Button
                                    onClick={handleOpenModal}
                                    icon={<FiPlus size={20} />}
                                    className="hover:cursor-pointer"
                                >
                                    Nuevo Contrato
                                </Button>
                            </div>
                        </header>
                        {/* Tarjetas de Estadísticas */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard
                                title="Total Contratos"
                                value={totalContracts}
                                description="Contratos registrados"
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
                                <div className="flex flex-wrap items-center gap-4 mt-4 sm:mt-0 w-full md:w-auto">
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
                            <div className="overflow-x-auto">
                                <table className="w-full text-md text-left text-slate-500">
                                    <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Nit del Cliente
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Tipo de Contrato
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Valor Canon
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Valor Base Equipo
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Periodo
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Fecha Inicio
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Fecha Fin
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Estado
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Canones
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right"
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
                                                    className="px-6 py-4 text-center text-slate-500"
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
                                                        className="px-6 py-4 text-center text-slate-500"
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
                                                className="bg-white border-b hover:bg-slate-50 text-[#000000]"
                                            >
                                                <td className="px-6 py-4">
                                                    {contract.clienteNit}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {contract.tipoContrato}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {formatNumber(
                                                        contract.valorCanon
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {formatNumber(
                                                        contract.valorBaseEquipo
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {contract.periodo}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {contract.fechaInicio}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {contract.fechaFin || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 text-xs">
                                                    {contract.estado ===
                                                    "ACTIVO" ? (
                                                        <span className="text-green-500 font-semibold border border-green-500 px-2 py-1 rounded">
                                                            {contract.estado}
                                                        </span>
                                                    ) : (
                                                        <span className="text-red-500 font-semibold border border-red-500 px-2 py-1 rounded">
                                                            INACTIVO
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {contract.canones.length > 0
                                                        ? contract.canones.map(
                                                              (canon) => (
                                                                  <div
                                                                      key={
                                                                          canon.grupo
                                                                      }
                                                                      className="flex items-center gap-2"
                                                                  >
                                                                      <div className="text-[#fffff] text-sm">
                                                                          {
                                                                              canon.grupo
                                                                          }
                                                                      </div>
                                                                      <div className="text-slate-500 font-bold text-sm">
                                                                          {
                                                                              canon.valorCanon
                                                                          }
                                                                      </div>
                                                                  </div>
                                                              )
                                                          )
                                                        : "N/A"}
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
                                                                    contract
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
                </div>
            )}
        </div>
    );
};

export default Contracts;
