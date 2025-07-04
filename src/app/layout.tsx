import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

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
                    <main className="flex-grow bg-slate-50 min-h-[calc(100vh-200px)]">
                        {children}
                    </main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
