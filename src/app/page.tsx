"use client";

import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { useRef } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.1 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }
};

export default function LandingPage() {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className="min-h-screen bg-surface font-inter text-primary selection:bg-tertiary-fixed selection:text-primary overflow-hidden">
      <Navbar />

      <main className="pt-24">
        {/* Hero & Search */}
        <section className="min-h-[85vh] lg:min-h-screen flex flex-col justify-center items-start px-6 lg:px-24 bg-surface-container-lowest relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-5xl w-full z-10"
          >
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] as any }}
              className="text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.85] text-primary mb-16 uppercase"
            >
              Precisión <br />Soberana.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="w-full mt-12 relative group"
            >
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-on-surface-variant/40 group-focus-within:text-accent transition-colors">search</span>
              </div>
              <input
                className="w-full bg-surface-container-low border-b-2 border-primary py-8 pl-18 pr-8 text-xl font-manrope tracking-tight focus:outline-none focus:border-accent transition-all uppercase placeholder:text-on-surface-variant/30"
                placeholder="BUSCAR EN LA BASE DE DATOS LEGAL, JURISPRUDENCIA O EXPEDIENTES"
                type="text"
              />
              <div className="absolute inset-y-0 right-6 flex items-center">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-2 cursor-pointer group/btn"
                >
                  <span className="text-[10px] font-black tracking-[0.3em] text-accent uppercase">Ejecutar Búsqueda</span>
                  <span className="material-symbols-outlined text-accent text-sm">arrow_forward</span>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-16 flex flex-wrap gap-8 text-[10px] font-black tracking-[0.3em] uppercase text-secondary/60"
            >
              <span>Arbitraje Internacional</span>
              <span className="text-outline-variant">/</span>
              <span>Propiedad Intelectual</span>
              <span className="text-outline-variant">/</span>
              <span>Litigios de Estado</span>
            </motion.div>
          </motion.div>

          <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-surface-container-low -z-10 hidden lg:block"></div>
        </section>

        {/* Proposition: Citizens */}
        <section className="grid grid-cols-1 lg:grid-cols-2 min-h-screen border-t border-outline-variant/10">
          <motion.div
            {...fadeInUp}
            className="flex flex-col justify-center p-8 lg:p-24 bg-surface order-2 lg:order-1"
          >
            <span className="text-accent font-black tracking-[0.4em] text-[10px] uppercase mb-10">Para Ciudadanos</span>
            <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter text-primary leading-[0.9] mb-12 uppercase">
              Acceso a la Alta <br />Autoridad Legal.
            </h2>
            <p className="text-lg text-secondary leading-relaxed max-w-md mb-12 font-inter font-light">
              Democratizando recursos legales de élite mediante precisión computacional. Navegue disputas complejas con la confianza de un arquitecto.
            </p>
            <div>
              <Link
                href="/register"
                className="inline-block bg-primary text-on-primary px-12 py-6 font-manrope text-xs font-black tracking-[0.3em] uppercase hover:bg-accent transition-all duration-500"
              >
                Explorar Suite Ciudadana
              </Link>
            </div>
          </motion.div>
          <div className="relative overflow-hidden order-1 lg:order-2 h-[50vh] lg:h-auto">
            <motion.img
              initial={{ scale: 1.1, filter: "grayscale(100%)" }}
              whileInView={{ scale: 1, filter: "grayscale(0%)" }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-1000"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXZdm-8N-I2Ydw7C2y02Vgn0A6-vfTSsuv0crG6kTWrZVfxgozxFARr-ocHcpB6Pv4lECj2gXEtv2aCPpsgKH2e8EeD3MK_bD07wPc4x_AmPavKcTE9gWClekkhbSo1oWsUXIIA8WZ1gMAb2ulZrgiMsk-_hznSR-nN-i6kNRTaAvQsaGlhT1942ad2ylP79PcuGCWSVFWr36I9z15xZHZI3o5i6DLqxpUTUJHlGHBhWYr-N0X89ZU2lkb6tYCHFUTyIcH4iIlgQSQ"
              alt="Precisión arquitectónica"
            />
          </div>
        </section>

        {/* Proposition: Lawyers */}
        <section className="grid grid-cols-1 lg:grid-cols-2 min-h-screen border-t border-outline-variant/10">
          <div className="relative overflow-hidden h-[50vh] lg:h-auto">
            <motion.img
              initial={{ scale: 1.1, filter: "grayscale(100%) contrast(125%)" }}
              whileInView={{ scale: 1, filter: "grayscale(40%) contrast(110%)" }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAd-LTXlRxhq1TKjANtHPkq0LCX_-eqU_ssqoHBn09NNJzLPFnInS4MUtNyhA62-rJ05ZqbOCVl2_LRExSgIuS9avOvEQ45hv6x3lQ6n7usMtRdij4uNLEoN__hN5sx7j1AVIe9NrkrPs7flJn8GqTIrcidXCrUhot_SPrfa2ahqqgHCSxKJQN-Nh0ahKjzZquRO0pOxEYkWrEf1qiyH5T3a8_VcwqIXhuY_M5ilp8BtmIs0hLgfjzZsTb6zFlxCIOTSwHYwDKermzb"
              alt="Herramientas legales"
            />
          </div>
          <motion.div
            {...fadeInUp}
            className="flex flex-col justify-center p-8 lg:p-24 bg-surface-container-lowest"
          >
            <span className="text-accent font-black tracking-[0.4em] text-[10px] uppercase mb-10">Para Profesionales Independientes</span>
            <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter text-primary leading-[0.9] mb-12 uppercase">
              El Arsenal <br />Legal Moderno.
            </h2>
            <p className="text-lg text-secondary leading-relaxed max-w-md mb-12 font-inter font-light">
              Empoderando al abogado independiente con capacidades de investigación de nivel corporativo. Herramientas de ingeniería de precisión para el defensor digital.
            </p>
            <div>
              <Link
                href="/marketplace"
                className="inline-block bg-primary text-on-primary px-12 py-6 font-manrope text-xs font-black tracking-[0.3em] uppercase hover:bg-accent transition-all duration-500"
              >
                Ver Herramientas Legales
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Proposition: Firms */}
        <section className="grid grid-cols-1 lg:grid-cols-2 min-h-screen border-t border-outline-variant/10">
          <motion.div
            {...fadeInUp}
            className="flex flex-col justify-center p-8 lg:p-24 bg-primary order-2 lg:order-1"
          >
            <span className="text-accent font-black tracking-[0.4em] text-[10px] uppercase mb-10">Para Instituciones Globales</span>
            <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter text-white leading-[0.9] mb-12 uppercase">
              Gobernanza <br />Institucional.
            </h2>
            <p className="text-lg text-white/60 leading-relaxed max-w-md mb-12 font-inter font-light">
              Infraestructura escalable para firmas de abogados globales. Gestionando la complejidad en múltiples jurisdicciones con estabilidad y velocidad.
            </p>
            <div>
              <Link
                href="/register?type=firm"
                className="inline-block bg-white text-primary px-12 py-6 font-manrope text-xs font-black tracking-[0.3em] uppercase hover:bg-accent hover:text-white transition-all duration-500"
              >
                Soluciones Corporativas
              </Link>
            </div>
          </motion.div>
          <div className="relative overflow-hidden order-1 lg:order-2 h-[50vh] lg:h-auto">
            <motion.img
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="w-full h-full object-cover grayscale"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtQAe74sd6ZCt6OgXxp7hGwPpQmksuubEubcvycXKuKmDA78qq8U04ehYn4NwcBDz5LdzbcskQF8tYzwVCG4GTgb6wC_aqMDsSwYmvRjGkRznf8eszpVIxsYhB-B-xyVwYQpTcXHLrE4cq-1fS_8pLtSNzA-AzDK6RN88h0c2J5dPPzzW7Nndn7LcbOqWbFs3fR93WPK8VDXHHpDNoq0XqynVFNUm3FAnRBAaP5AKnFr8XU9eTFoGwjP4WCSC5uEHryjcm6ARQP3iN"
              alt="Gobernanza institucional"
            />
          </div>
        </section>

        {/* Trust Stats */}
        <section className="bg-surface-container-low py-32 px-6 lg:px-24">
          <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-24">
            <motion.div
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: 0.1 }}
              className="border-l border-primary/20 pl-8"
            >
              <div className="text-6xl lg:text-8xl font-black tracking-tighter mb-6 text-primary">100%</div>
              <div className="text-[10px] font-black tracking-[0.3em] uppercase text-secondary">Gestión Digital e Inmediata</div>
            </motion.div>
            <motion.div
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: 0.2 }}
              className="border-l border-primary/20 pl-8"
            >
              <div className="text-6xl lg:text-8xl font-black tracking-tighter mb-6 text-primary">24/7</div>
              <div className="text-[10px] font-black tracking-[0.3em] uppercase text-secondary">Información Siempre Disponible</div>
            </motion.div>
            <motion.div
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: 0.3 }}
              className="border-l border-primary/20 pl-8"
            >
              <div className="text-6xl lg:text-8xl font-black tracking-tighter mb-6 text-primary">Audit</div>
              <div className="text-[10px] font-black tracking-[0.3em] uppercase text-secondary">Trazabilidad Total de Procesos</div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

