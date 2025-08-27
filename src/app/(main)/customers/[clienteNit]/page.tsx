"use client";
import React from "react";
import {
    IoChevronBack,
    IoDocumentTextOutline,
    IoPrintOutline,
} from "react-icons/io5";
import type { printerType } from "@/types/printerType";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import Link from "next/link";
import { FiPenTool, FiPrinter } from "react-icons/fi";
import { Tooltip } from "@/components/ui/Tooltip";
import { getPrintersByNitService } from "@/services/printerService";
import { GrConfigure } from "react-icons/gr";
import { AssignPrinter } from "@/components/ui/AssignPrinter";
import { ReAssignPrinter } from "@/components/ui/ReAssignPrinter";

const ContractDetails = () => {
    const { clienteNit } = useParams();
    const [param] = useState<string>(clienteNit as string);

    const [printers, setPrinters] = useState<printerType[]>([]);

    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState<printerType>(
        {} as printerType
    );
    const [error, setError] = useState<string>("");

    const fetchContract = async () => {
        const response = await getPrintersByNitService(
            clienteNit?.toString() || ""
        );
        console.log("Response from getPrintersByNitService:", response);
        if (response.status) {
            console.log("Contract fetched successfully:", response);
            setPrinters(response.data);
        } else {
            console.error("Error fetching contract:", response.message);
            setError(response.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchContract();
    }, [clienteNit, isModalCreateOpen]);

    const handleOpenModal = (printer: printerType) => {
        setSelectedContract(printer);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => setIsModalOpen(false);

    const handleOpenCreateModal = () => setIsModalCreateOpen(true);
    const handleCloseCreateModal = () => setIsModalCreateOpen(false);

    const handleEditationSuccess = (message: string) => {
        toast.success(message);
    };

    const handleCreationSuccess = (message: string, data: printerType) => {
        toast.success(message);
        setPrinters((prevPrinters) => [...prevPrinters, data]);
        fetchContract();
    };

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8 font-sans">
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
                </div>
            ) : printers.length > 0 ? (
                <div className="max-w-7xl mx-auto">
                    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <div className="flex items-center mb-4 sm:mb-0">
                            <button className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
                                <IoChevronBack className="w-6 h-6" />
                                <Link href="/customers">
                                    <span className="ml-2 mr-2 font-semibold">
                                        Volver a Clientes
                                    </span>
                                </Link>
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-[#1A2541]">
                                    <FiPrinter className="inline-block w-10 h-10 mr-2" />
                                    Impresoras de #{" "}
                                    {clienteNit || "No disponible"}
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 w-full sm:w-auto">
                            <button
                                className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#1A2541] hover:bg-gray-900 hover:cursor-pointer transition-colors duration-200"
                                onClick={handleOpenCreateModal}
                            >
                                <FiPrinter className="w-5 h-5 mr-2" />
                                Asignar Impresora
                            </button>
                        </div>
                    </header>
                    {printers.map((printer, index) => (
                        <main
                            className="bg-white p-6 rounded-lg shadow-md mb-6"
                            key={index}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="flex items-center text-lg font-semibold mb-6">
                                    <IoDocumentTextOutline className="w-6 h-6 mr-3" />
                                    Impresora #{index + 1}
                                </h2>
                                <Tooltip text="Editar Detalle">
                                    <button
                                        className="flex items-center bg-[#4F628E] px-3 py-3 text-sm font-medium text-white hover:bg-[#8C9EC2] hover:cursor-pointer rounded-lg transition-colors duration-200"
                                        onClick={() => handleOpenModal(printer)}
                                    >
                                        <FiPenTool className="w-4 h-4" />
                                    </button>
                                </Tooltip>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-8">
                                {/* Tipo de Operación */}
                                <div className="flex items-start">
                                    <IoPrintOutline className="w-6 h-6 text-[#8C9EC2] mt-1 mr-4" />
                                    <div>
                                        <p className="text-sm text-[#8C9EC2]">
                                            Serial de Impresora
                                        </p>
                                        <p className="text-base font-semibold text-gray-800">
                                            {printer.serial || "No definido"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <GrConfigure className="w-6 h-6 text-[#8C9EC2] mt-1 mr-4" />
                                    <div>
                                        <p className="text-sm text-[#8C9EC2]">
                                            Modelo de Impresora
                                        </p>
                                        <p className="text-base font-semibold text-gray-800">
                                            {printer.modelo ?? 0}
                                        </p>
                                    </div>
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
                                <Link href="/customers" className="flex">
                                    <IoChevronBack className="w-6 h-6" />
                                    <span className="ml-2 mr-2 font-semibold hidden md:block">
                                        Volver a Clientes
                                    </span>
                                </Link>
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-[#1A2541]">
                                    No Hay Impresoras Asignadas
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
                                <FiPrinter className="w-5 h-5 mr-2" />
                                Asignar Impresora
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
                                href="/customers"
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
                <ReAssignPrinter
                    onClose={handleCloseModal}
                    onSuccess={handleEditationSuccess}
                    initialData={selectedContract}
                />
            </Modal>
            <Modal isOpen={isModalCreateOpen} onClose={handleCloseCreateModal}>
                <AssignPrinter
                    onClose={handleCloseCreateModal}
                    onSuccess={handleCreationSuccess}
                    clienteNit={param}
                />
            </Modal>
        </div>
    );
};

export default ContractDetails;
