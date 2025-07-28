import React, { useEffect, useState } from "react";
import type { GetReadyType } from "@/types/counterType";
import { Slider } from "@/components/ui/counter/Slider";

interface CreateContractFormProps {
    onClose: () => void;
    onSuccess: (message: string, data: GetReadyType) => void;
    clienteNit: string;
}

export const CreateCounter = ({
    onClose,
    onSuccess,
    clienteNit,
}: CreateContractFormProps) => {
    const [dataForm, setData] = useState<GetReadyType>({
        serial: "",
        modelo: "",
        tipoOperacion: "",
        contadorAnterior: "",
        contadorActual: "",
        consumo: "",
    });

    return (
        <div>
            <Slider
                onSuccess={(message) => {
                    onSuccess(message, dataForm);
                }}
                clientNit={clienteNit}
            />
            {/* Aquí puedes agregar más lógica para manejar el formulario */}
        </div>
    );
};
