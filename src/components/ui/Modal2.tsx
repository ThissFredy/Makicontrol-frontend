import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const Modal2 = ({ isOpen, onClose, children }: ModalProps) => {
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity"
            role="dialog"
            aria-modal="true"
        >
            <div
                className="relative sm:w-full md:w-2xl lg:w-3xl transform rounded-xl bg-white p-6 shadow-xl transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:cursor-pointer transition-colors"
                >
                    <FiX size={24} />
                </button>
                {children}
            </div>
        </div>
    );
};
