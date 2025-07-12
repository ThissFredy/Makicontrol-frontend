import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
    title: "Login",
    description: "Descripción de la plataforma o modelo de negocio",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className={"font-inter bg-white text-slate-900"}>
                <div className="flex min-h-screen flex-col">
                    <Header />
                    <main className="flex-grow bg-[#F0F2F5] min-h-[calc(100vh-200px)]">
                        {children}
                        <Toaster
                            position="top-center"
                            toastOptions={{
                                style: {
                                    background: "#363636",
                                    color: "#fff",
                                    padding: "30px",
                                    fontSize: "20px",
                                    borderRadius: "8px",
                                    minWidth: "350px",
                                },

                                // Estilos específicos para notificaciones de éxito
                                success: {
                                    duration: 3000, // Duración en milisegundos
                                    style: {
                                        background: "#10B981", // Fondo verde para éxito
                                    },
                                },

                                // Estilos específicos para notificaciones de error
                                error: {
                                    duration: 5000, // Más duración para los errores
                                    style: {
                                        background: "#EF4444", // Fondo rojo para error
                                    },
                                },
                            }}
                        />
                    </main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
