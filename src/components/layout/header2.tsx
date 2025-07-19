"use client";
import Link from "next/link";
import Image from "next/image";
import { FiChevronDown, FiFileText, FiLogOut, FiUsers } from "react-icons/fi";
import { useState, useRef } from "react";
import { removeTokenCookie } from "@/utilities/loginUtility";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

const Header2 = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        try {
            removeTokenCookie();
            logout();
            toast.success("Sesión cerrada correctamente");
            router.push("/login");
        } catch (error) {
            toast.error("Error al cerrar sesión");
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <header className="bg-[#8C9EC2] shadow-md min-h-[60px]">
            <div className="w-full flex justify-between items-center px-4">
                <div className="flex justify-center md:justify-start m-1 items-center h-23">
                    <Link href="/">
                        <Image
                            src="/logo.svg"
                            alt="Logo de MAKI"
                            width={150}
                            height={50}
                            priority
                            className="w-[150px] h-[50px] object-contain"
                        />
                    </Link>
                    <nav className="hidden md:flex items-center text-white space-x-6 ml-10">
                        <Link
                            href="/customers"
                            className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                        >
                            <FiUsers size={18} />
                            <span className="font-medium">Clientes</span>
                        </Link>

                        <Link
                            href="/contracts"
                            className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                        >
                            <FiFileText size={18} />
                            <span className="font-medium">Contratos</span>
                        </Link>
                    </nav>
                    <nav className="flex items-center space-x-6 ml-10 md:hidden">
                        <Link
                            href="/customers"
                            className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                        >
                            <FiUsers size={18} />
                        </Link>

                        <Link
                            href="/contracts"
                            className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                        >
                            <FiFileText size={18} />
                        </Link>
                    </nav>
                </div>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                    >
                        <span className="font-medium">
                            {user?.sub || "Usuario Anónimo"}
                        </span>
                        <FiChevronDown
                            size={16}
                            className={`transition-transform ${
                                showUserMenu ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                            <div className="py-2">
                                <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                                    {user?.sub || "Usuario Anónimo"}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <FiLogOut size={16} />
                                    <span>Cerrar sesión</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header2;
