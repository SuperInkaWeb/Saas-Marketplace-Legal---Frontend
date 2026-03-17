import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-['Inter',sans-serif]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-linear-to-b from-slate-200/50 to-transparent -z-10 opacity-70"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold mb-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Nueva era en servicios legales
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Transparencia y excelencia <br />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-slate-900 via-blue-900 to-slate-800">
              en cada paso legal.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 font-light leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Conectamos a profesionales del derecho y clientes en un entorno seguro. 
            Gestiona documentos, comunícate eficientemente y haz seguimiento real a tus procesos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-slate-200 hover:-translate-y-0.5"
            >
              Comenzar ahora
            </Link>
            <button className="w-full sm:w-auto bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-all">
              Ver Demo
            </button>
          </div>

          <div className="mt-20 relative animate-in fade-in zoom-in duration-1000 delay-500">
            <div className="absolute inset-0 bg-linear-to-t from-slate-50 to-transparent z-10 h-32 bottom-0 top-auto"></div>
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform lg:rotate-1 hover:rotate-0 transition-transform duration-700">
              <div className="h-10 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
              </div>
              <div className="aspect-video bg-slate-50/50 flex items-center justify-center text-slate-300">
                <i className="fas fa-layer-group text-8xl opacity-10"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Todo lo que necesitas en un solo lugar</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Diseñado específicamente para optimizar la relación entre abogados y sus clientes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-all group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <i className="fas fa-shield-alt text-slate-900 text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Seguridad Total</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Encriptación de punto a punto para que tus documentos y comunicaciones legales siempre estén protegidos.</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-all group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <i className="fas fa-bolt text-slate-900 text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Eficiencia Radical</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Automatiza tareas repetitivas y gestiona tus expedientes con una interfaz intuitiva y moderna.</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-all group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <i className="fas fa-users text-slate-900 text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Colaboración Real</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Canales de chat y gestión de documentos compartidos para que nunca pierdas el hilo de tus procesos.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
