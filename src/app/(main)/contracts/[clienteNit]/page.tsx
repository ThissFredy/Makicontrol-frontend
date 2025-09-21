"use client";
import { useCallback, useState } from "react";
import {
    IoChevronBack,
    IoDocumentTextOutline,
    IoPrintOutline,
} from "react-icons/io5";
import type { ContractDetailType } from "@/types/contractType";
import { getContractDetailsByIdService } from "@/services/contractService";
import { formatNumber } from "@/utilities/moneyUtility";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { EditDetailsContract } from "@/components/ui/EditDetailsContract";
import { CreateDetailsContract } from "@/components/ui/CreateDetailsContract";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import Link from "next/link";
import { FiPenTool } from "react-icons/fi";
import { Tooltip } from "@/components/ui/Tooltip";

const ContractDetails = () => {
    const { clienteNit } = useParams();
    const [param] = useState<string>(clienteNit as string);

    const [contracts, setContracts] = useState<ContractDetailType[]>([]);

    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
    const [selectedContract, setSelectedContract] =
        useState<ContractDetailType>({} as ContractDetailType);
    const [error, setError] = useState<string>("");

    const fetchContract = useCallback(async () => {
        const response = await getContractDetailsByIdService(
            Number(clienteNit)
        );
        if (response.status) {
            setContracts(response.data);
        } else {
            setError(response.message);
        }
        setLoading(false);
    }, [clienteNit]);

    useEffect(() => {
        fetchContract();
    }, [fetchContract]);

    const handleOpenModal = (contract: ContractDetailType) => {
        setSelectedContract(contract);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => setIsModalOpen(false);

    const handleOpenCreateModal = () => setIsModalCreateOpen(true);
    const handleCloseCreateModal = () => setIsModalCreateOpen(false);

    const handleEditationSuccess = (
        message: string,
        data: ContractDetailType
    ) => {
        toast.success(message);
        setContracts((prevContracts) =>
            prevContracts.map((contract) =>
                contract.id === data.id ? data : contract
            )
        );
    };

    const handleCreationSuccess = (message: string) => {
        toast.success(message);
        fetchContract();
    };

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8 font-sans">
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
                </div>
            ) : contracts.length > 0 ? (
                <div className="max-w-7xl mx-auto">
                    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <div className="flex items-center mb-4 sm:mb-0">
                            <button className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
                                <IoChevronBack className="w-6 h-6" />
                                <Link href="/contracts">
                                    <span className="ml-2 mr-2 font-semibold">
                                        Volver a Contratos
                                    </span>
                                </Link>
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-[#1A2541]">
                                    Cliente #{" "}
                                    {contracts[0].clienteNit || "No disponible"}
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 w-full sm:w-auto">
                            <button
                                className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#1A2541] hover:bg-gray-900 hover:cursor-pointer transition-colors duration-200"
                                onClick={handleOpenCreateModal}
                            >
                                <FiPenTool className="w-5 h-5 mr-2" />
                                Crear Detalle
                            </button>
                        </div>
                    </header>
                    {contracts.map((contract, index) => (
                        <main
                            className="bg-white p-6 rounded-lg shadow-md mb-6"
                            key={index}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="flex items-center text-lg font-semibold mb-6">
                                    <IoDocumentTextOutline className="w-6 h-6 mr-3" />
                                    Detalles del Contrato #{index + 1}
                                </h2>
                                <Tooltip text="Editar Detalle">
                                    <button
                                        className="flex items-center bg-[#4F628E] px-3 py-3 text-sm font-medium text-white hover:bg-[#8C9EC2] hover:cursor-pointer rounded-lg transition-colors duration-200"
                                        onClick={() =>
                                            handleOpenModal(contract)
                                        }
                                    >
                                        <FiPenTool className="w-4 h-4" />
                                    </button>
                                </Tooltip>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
                                {/* Tipo de Operación */}
                                <div className="flex items-start">
                                    <IoPrintOutline className="w-6 h-6 text-[#8C9EC2] mt-1 mr-4" />
                                    <div>
                                        <p className="text-sm text-[#8C9EC2]">
                                            Tipo de Operación
                                        </p>
                                        <p className="text-base font-semibold text-gray-800">
                                            {contract.tipoOperacion ||
                                                "No definido"}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-[#8C9EC2]">
                                        Límite Incluido
                                    </p>
                                    <p className="text-base font-semibold text-gray-800">
                                        {formatNumber(
                                            contract.limiteIncluido ?? 0
                                        )}{" "}
                                    </p>
                                </div>

                                {/* Valor Base */}
                                <div>
                                    <p className="text-sm text-[#8C9EC2]">
                                        Valor Base
                                    </p>
                                    <p className="text-base font-semibold text-gray-800">
                                        <CurrencyInput
                                            input={false}
                                            value={contract.valorBase ?? 0}
                                        />
                                    </p>
                                </div>

                                {/* Valor Unitario Excedente */}
                                <div>
                                    <p className="text-sm text-[#8C9EC2]">
                                        Valor Unitario Excedente
                                    </p>
                                    <p className="text-base font-semibold text-gray-800">
                                        <CurrencyInput
                                            input={false}
                                            value={contract.valorUnitario ?? 0}
                                        />
                                    </p>
                                </div>

                                {/* Modo de Cobro */}
                                <div>
                                    <p className="text-sm text-[#8C9EC2] mb-1">
                                        Modo de Cobro
                                    </p>
                                    <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                                        {contract.modoCobro || "No definido"}
                                    </span>
                                </div>

                                {/* Cliente NIT */}
                                <div>
                                    <p className="text-sm text-[#8C9EC2]">
                                        Cliente NIT
                                    </p>
                                    <p className="text-base font-semibold text-gray-800">
                                        {contract.clienteNit || "No definido"}
                                    </p>
                                </div>
                            </div>
                        </main>
                    ))}
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <div className="flex items-center mb-4 sm:mb-0">
                            <button className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
                                <Link href="/contracts" className="flex">
                                    <IoChevronBack className="w-6 h-6" />
                                    <span className="ml-2 mr-2 font-semibold hidden md:block">
                                        Volver a Contratos
                                    </span>
                                </Link>
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-[#1A2541]">
                                    Detalles de Contrato No Encontrados
                                </h1>
                                <p className="text-sm text-gray-500">
                                    NIT: {clienteNit}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center mb-4 sm:mb-0">
                            <button
                                className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#1A2541] hover:bg-gray-900 hover:cursor-pointer transition-colors duration-200"
                                onClick={handleOpenCreateModal}
                            >
                                <FiPenTool className="w-5 h-5 mr-2" />
                                Crear Detalle
                            </button>
                        </div>
                    </header>
                    <main className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex flex-col items-center justify-center py-12">
                            <IoDocumentTextOutline className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                No hay datos disponibles
                            </h3>
                            <p className="text-gray-500 text-center max-w-md">
                                {error ||
                                    "No se encontraron datos para el contrato con el NIT proporcionado."}
                                <br />
                                NIT {clienteNit}.
                            </p>
                            <Link
                                href="/contracts"
                                className="mt-6 flex items-center px-4 py-2 bg-[#1A2541] text-white rounded-lg hover:bg-gray-900 transition-colors"
                            >
                                <IoChevronBack className="w-5 h-5 mr-2" />
                                Volver a la lista
                            </Link>
                        </div>
                    </main>
                </div>
            )}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <EditDetailsContract
                    onClose={handleCloseModal}
                    onSuccess={handleEditationSuccess}
                    initialData={selectedContract}
                />
            </Modal>
            <Modal isOpen={isModalCreateOpen} onClose={handleCloseCreateModal}>
                <CreateDetailsContract
                    onClose={handleCloseCreateModal}
                    onSuccess={handleCreationSuccess}
                    clienteNIT={param}
                />
            </Modal>
        </div>
    );
};

export default ContractDetails;
