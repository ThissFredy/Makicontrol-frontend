import React from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Link from "next/link";

const NotFound = () => {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow bg-[#F0F2F5] flex items-center justify-center text-center px-4">
                <div>
                    <h1 className="text-6xl font-bold text-[#E87A3E] ">404</h1>
                    <p className="mt-4 text-2xl font-bold tracking-tight text-slate-800 sm:text-4xl">
                        Página no encontrada
                    </p>
                    <p className="mt-6 text-base leading-7 text-slate-600">
                        Lo sentimos, la página que estás buscando no existe o ha
                        sido movida.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link
                            href="/"
                            className="rounded-md bg-[#E87A3E] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#D76B2D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E87A3E]"
                        >
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default NotFound;
