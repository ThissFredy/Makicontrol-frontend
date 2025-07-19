import Header2 from "@/components/layout/header2";
import Footer from "@/components/layout/footer";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header2 />
            <main className="flex-grow bg-[#F0F2F5] min-h-[calc(100vh-200px)]">
                {children}
            </main>
            <Footer />
        </div>
    );
}
