import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-10 bg-gray-50 border-t border-gray-200 sm:pt-16 lg:pt-24">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-screen-xl">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-16 gap-x-12">
          {/* Logo y Redes Sociales */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 lg:pr-8">
            <div className="flex items-center gap-2 mb-7">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">Legit</span>
            </div>

            <p className="text-base leading-relaxed text-gray-600">
              Transformando la industria legal mediante tecnología, transparencia y un diseño centrado en el usuario para profesionales y clientes.
            </p>

            <ul className="flex items-center space-x-3 mt-9">
              <li>
                <a href="#" className="flex items-center justify-center text-white transition-all duration-200 bg-slate-900 rounded-full w-8 h-8 hover:bg-blue-600">
                  <i className="fab fa-twitter text-sm"></i>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center justify-center text-white transition-all duration-200 bg-slate-900 rounded-full w-8 h-8 hover:bg-blue-600">
                  <i className="fab fa-facebook-f text-sm"></i>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center justify-center text-white transition-all duration-200 bg-slate-900 rounded-full w-8 h-8 hover:bg-blue-600">
                  <i className="fab fa-instagram text-sm"></i>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center justify-center text-white transition-all duration-200 bg-slate-900 rounded-full w-8 h-8 hover:bg-blue-600">
                  <i className="fab fa-github text-sm"></i>
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">Empresa</p>

            <ul className="mt-6 space-y-4">
              <li>
                <a href="#" className="flex text-base text-black transition-all duration-200 hover:text-blue-600"> Nosotros </a>
              </li>
              <li>
                <a href="#" className="flex text-base text-black transition-all duration-200 hover:text-blue-600"> Funcionalidades </a>
              </li>
              <li>
                <a href="#" className="flex text-base text-black transition-all duration-200 hover:text-blue-600"> Casos de éxito </a>
              </li>
              <li>
                <a href="#" className="flex text-base text-black transition-all duration-200 hover:text-blue-600"> Carrera </a>
              </li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">Ayuda</p>

            <ul className="mt-6 space-y-4">
              <li>
                <a href="#" className="flex text-base text-black transition-all duration-200 hover:text-blue-600"> Soporte </a>
              </li>
              <li>
                <a href="#" className="flex text-base text-black transition-all duration-200 hover:text-blue-600"> Tutoriales </a>
              </li>
              <li>
                <a href="#" className="flex text-base text-black transition-all duration-200 hover:text-blue-600"> Términos y Condiciones </a>
              </li>
              <li>
                <a href="#" className="flex text-base text-black transition-all duration-200 hover:text-blue-600"> Privacidad </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2 lg:pl-8">
            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">Suscríbete al newsletter</p>

            <form action="#" method="POST" className="mt-6">
              <div>
                <label htmlFor="email-footer" className="sr-only">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  id="email-footer" 
                  placeholder="Tu correo electrónico" 
                  className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600" 
                />
              </div>

              <button type="submit" className="inline-flex items-center justify-center px-6 py-4 mt-3 font-semibold text-white transition-all duration-200 bg-blue-600 rounded-md hover:bg-blue-700 focus:bg-blue-700">
                Suscribirse
              </button>
            </form>
          </div>
        </div>

        <hr className="mt-16 mb-10 border-gray-200" />

        <p className="text-sm text-center text-gray-600">© {new Date().getFullYear()} Legit Platform. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
