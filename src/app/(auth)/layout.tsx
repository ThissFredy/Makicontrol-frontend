import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow bg-[#F0F2F5] min-h-[calc(100vh-200px)]">
                {children}
            </main>
            <Footer />
        </div>
    );
}
