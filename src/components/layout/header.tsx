import Link from "next/link";
import Image from "next/image";

// --- Componente Header ---
const Header = () => {
    return (
        <header className="bg-[#8C9EC2] shadow-md min-h-[60px]">
            <div className="w-full">
                <div className="flex justify-center md:justify-start m-1 items-center h-23">
                    <Link href="/">
                        <Image
                            src="/logo.svg"
                            alt="Logo de MAKI"
                            width={150}
                            height={0}
                            className="h-10 md:h-12"
                        />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
