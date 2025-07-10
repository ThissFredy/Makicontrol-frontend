import Image from "next/image";

interface ContactInfo {
    email: string;
    phone: string;
    address: string;
}

interface SocialIcons {
    facebook: string;
    instagram: string;
    whatsapp: string;
    mail: string;
    phone: string;
    mapPin: string;
}

const Footer = () => {
    const icons: SocialIcons = {
        facebook: "/icons/facebook.svg",
        instagram: "/icons/instagram.svg",
        whatsapp: "/icons/whatsapp.svg",
        mail: "/icons/mail.svg",
        phone: "/icons/phone.svg",
        mapPin: "/icons/map-pin.svg",
    };

    // Información de contacto con tipado
    const contactInfo: ContactInfo = {
        email: "info@maki.com",
        phone: "+57 3314567890",
        address: "123 Calle Principal A",
    };

    const descripcion: string =
        "Descripción de la plataforma o modelo de negocio. Aquí puedes incluir información relevante sobre tu empresa.";

    return (
        <footer className="bg-[#1A2541] text-slate-300">
            <div className="container mx-auto px-6 py-10">
                <div className="flex flex-wrap justify-between gap-10">
                    {/* Columna Izquierda: Logo y Social */}
                    <div className="w-full md:w-1/3">
                        <h2 className="text-2xl font-bold text-white">MAKI</h2>
                        <p className="mt-2 max-w-sm">{descripcion}</p>
                        <div className="mt-4 flex gap-4">
                            <a href="#" className="hover:text-white">
                                <Image
                                    src={icons.facebook}
                                    alt="Facebook"
                                    width={20}
                                    height={20}
                                    className="h-5 w-5"
                                />
                            </a>
                            <a href="#" className="hover:text-white">
                                <Image
                                    src={icons.instagram}
                                    alt="Instagram"
                                    width={20}
                                    height={20}
                                    className="h-5 w-5"
                                />
                            </a>
                            <a href="#" className="hover:text-white">
                                <Image
                                    src={icons.whatsapp}
                                    alt="WhatsApp"
                                    width={20}
                                    height={20}
                                    className="h-5 w-5"
                                />
                            </a>
                        </div>
                    </div>

                    {/* Columna Derecha: Contacto */}
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            Contacto
                        </h3>
                        <ul className="mt-4 space-y-3">
                            <li className="flex items-center gap-3">
                                <Image
                                    src={icons.mail}
                                    alt="Email"
                                    width={20}
                                    height={20}
                                    className="h-5 w-5"
                                />
                                <span>{contactInfo.email}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Image
                                    src={icons.phone}
                                    alt="Teléfono"
                                    width={20}
                                    height={20}
                                    className="h-5 w-5"
                                />
                                <span>{contactInfo.phone}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Image
                                    src={icons.mapPin}
                                    alt="Dirección"
                                    width={20}
                                    height={20}
                                    className="h-5 w-5"
                                />
                                <span>{contactInfo.address}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex flex-wrap justify-between items-center text-sm text-slate-400 gap-4">
                        <p>@ 2025 MAKI. Todos los derechos reservados.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white">
                                Política de Privacidad
                            </a>
                            <a href="#" className="hover:text-white">
                                Cookies
                            </a>
                            <a href="#" className="hover:text-white">
                                Términos de Servicio
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
