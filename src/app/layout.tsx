import type { Metadata } from "next";
import "@/app/globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
    title: "Maki Control",
    description: "Gestión de clientes y servicios",
    keywords: ["Maki Control", "Gestión de Clientes", "Servicios"],
    authors: [{ name: "Maki Control Team", url: "https://makicontrol.com" }],
    creator: "Maki Control",
    publisher: "Maki Control",
    robots: {
        index: false,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" className="scroll-smooth">
            <body className="bg-white text-slate-900 font-inter">
                {children}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: "#363636",
                            color: "#fff",
                            padding: "30px",
                            fontSize: "15px",
                            borderRadius: "8px",
                            minWidth: "350px",
                        },
                        success: {
                            duration: 3000,
                            style: {
                                background: "#10B981",
                            },
                        },
                        error: {
                            duration: 5000,
                            style: {
                                background: "#EF4444",
                            },
                        },
                    }}
                />
            </body>
        </html>
    );
}
