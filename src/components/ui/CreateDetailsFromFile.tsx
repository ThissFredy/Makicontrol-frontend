import React from "react";
import { uploadDetailsContractsFileService } from "@/services/contractService";
import { toast } from "react-hot-toast";
import { FiLoader, FiUploadCloud, FiX } from "react-icons/fi";

interface CreateDetailsFromFileProps {
    onClose: () => void;
    onSuccess: (message: string) => void;
}

export const CreateDetailsFromFile = ({
    onClose,
    onSuccess,
}: CreateDetailsFromFileProps) => {
    const [file, setFile] = React.useState<File | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isDragOver, setIsDragOver] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            toast.error("No has seleccionado ningún archivo.");
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await uploadDetailsContractsFileService(formData);

            if (response.status) {
                onSuccess(response.message);
                onClose();
            } else {
                toast.error(
                    response.message ||
                        "Hubo un problema al procesar el archivo."
                );
            }
        } catch (error) {
            console.error("Error en la subida:", error);
            toast.error("Ocurrió un error inesperado.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (file: File | null) => {
        if (!file) {
            setFile(null);
            return;
        }
        if (file.type !== "text/csv" && file.type !== "application/json") {
            toast.error("Por favor, sube un archivo CSV o JSON válido.");
            return;
        }
        setFile(file);
    };

    const handleDragEvents = (
        e: React.DragEvent<HTMLLabelElement>,
        over: boolean
    ) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(over);
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        handleDragEvents(e, false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            handleChange(droppedFile);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                    Crear Detalles de Contratos desde Archivo
                </h2>
                <p className="mt-1 text-slate-500">
                    Sube un archivo .csv para registrar múltiples detalles de
                    contratos a la vez.
                </p>
                <a
                    href="/files/detallesContrato.csv"
                    download
                    className="mt-4 inline-block text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                    Descargar plantilla de ejemplo
                </a>
            </div>

            <div className="flex-grow">
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".csv"
                    onChange={(e) => handleChange(e.target.files?.[0] || null)}
                    disabled={isLoading}
                />
                <label
                    htmlFor="file-upload"
                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer
                        transition-colors duration-200
                        ${
                            isDragOver
                                ? "border-indigo-500 bg-indigo-50"
                                : "border-slate-300 hover:border-slate-400"
                        }
                        ${file ? "border-green-500 bg-green-50" : ""}`}
                    onDragOver={(e) => handleDragEvents(e, true)}
                    onDragLeave={(e) => handleDragEvents(e, false)}
                    onDrop={handleDrop}
                >
                    {file ? (
                        <div className="text-center">
                            <p className="font-semibold text-green-700">
                                ¡Archivo listo!
                            </p>
                            <p className="text-sm text-slate-600">
                                {file.name}
                            </p>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setFile(null);
                                }}
                                className="mt-2 p-1 text-red-500 hover:text-red-700"
                                aria-label="Remover archivo"
                            >
                                <FiX size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="text-center text-slate-500">
                            <FiUploadCloud size={40} className="mx-auto mb-2" />
                            <p className="font-semibold">
                                Arrastra y suelta tu archivo aquí
                            </p>
                            <p className="text-sm">
                                o haz clic para seleccionar
                            </p>
                            <p className="text-xs mt-2">Solo archivos .csv</p>
                        </div>
                    )}
                </label>
            </div>

            <div className="mt-8 flex justify-end gap-4">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-4 py-2.5 font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading || !file}
                    className="flex items-center justify-center gap-2 w-36 px-4 py-2.5 font-semibold 
                    text-white bg-slate-800 rounded-lg shadow-md hover:bg-slate-700 focus:outline-none 
                    focus:ring-2 focus:ring-offset-2 focus:ring-slate-800 transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <FiLoader className="animate-spin" />
                            <span>Subiendo...</span>
                        </>
                    ) : (
                        "Crear Clientes"
                    )}
                </button>
            </div>
        </form>
    );
};
