import Image from "next/image";

export default function RightHero() {
    return (
        <>
            <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative bg-primary items-center justify-center p-12 overflow-hidden">
                <Image
                    src="/banner-login.jpg"
                    alt="Banner de plataforma legal"
                    fill
                    sizes="(min-width: 1280px) 58vw, (min-width: 1024px) 50vw, 0vw"
                    className="object-cover"
                    priority
                />
                {/* Negro transparente overlay */}
                <div className="absolute inset-0 bg-primary/60"></div>
                <div className="absolute inset-0 bg-linear-to-r from-primary via-primary/20 to-transparent"></div>

                <div className="relative z-10 max-w-xl text-left">
                    <div className="w-12 h-1 bg-accent mb-6 rounded-full"></div>
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                        Transparencia y excelencia <br />en cada paso legal.
                    </h2>
                    <p className="text-lg text-gray-300 font-light leading-relaxed max-w-md">
                        Conectamos a profesionales del derecho y clientes en un entorno seguro. Gestiona documentos, comunícate fácilmente y haz seguimiento a tus procesos en tiempo real.
                    </p>
                </div>
            </div>
        </>
    )
}