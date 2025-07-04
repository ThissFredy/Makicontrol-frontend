import Image from "next/image";
import Link from "next/link";

const Header = () => {
    return (
        <header className="bg-[#8C9EC2] shadow-md min-h-[60px] p-2">
            <div className="container w-full m-4">
                <Link href="/">
                    <Image
                        src="/logo.svg"
                        alt="Logo de MAKI"
                        width={40}
                        height={40}
                        className="h-10 md:h-15"
                    />
                </Link>
            </div>
        </header>
    );
};

export default Header;
