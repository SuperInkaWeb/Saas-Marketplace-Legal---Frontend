"use client";

import React, { useState } from "react";
import { CheckCircle, ShieldCheck, Sparkles, Building2 } from "lucide-react";

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<"FREE" | "PREMIUM" | "CORPORATE">("FREE");

  const plans = [
    {
      id: "FREE",
      name: "Plan Básico",
      target: "Abogados Independientes",
      icon: <ShieldCheck className="w-6 h-6 text-slate-500" />,
      price: "$0",
      description: "Esencial para gestionar citas y perfil público.",
      features: [
        "Perfil público en la plataforma",
        "Gestión de hasta 5 citas al mes",
        "Soporte por correo electrónico",
      ],
      disabled: false
    },
    {
      id: "PREMIUM",
      name: "Plan Premium",
      target: "Abogados Activos",
      icon: <Sparkles className="w-6 h-6 text-amber-500" />,
      price: "$49.99",
      description: "El paquete completo con herramientas avanzadas e IA Legal.",
      features: [
        "Agenda ilimitada y pagos integrados",
        "Asistente IA Legal Avanzado",
        "Análisis de Documentos con IA",
        "Destacado en búsquedas",
      ],
      popular: true,
      disabled: false
    },
    {
      id: "CORPORATE",
      name: "Plan Corporativo",
      target: "Estudios Jurídicos",
      icon: <Building2 className="w-6 h-6 text-blue-500" />,
      price: "$199.99",
      description: "Diseñado para bufetes grandes con múltiples usuarios.",
      features: [
        "Todo lo de Premium",
        "Múltiples perfiles de abogados",
        "Facturación unificada",
        "Dashboard gerencial",
      ],
      disabled: false
    }
  ];

  const handleSubscribe = async (planId: string) => {
    // Aquí iría la lógica hacia Stripe / MercadoPago o endpoint de upgrade
    alert(`Redirigiendo a pasarela de pago para el plan: ${planId}`);
  };

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Potencia tu práctica legal</h1>
        <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
          Elige el plan que mejor se adapte a tus necesidades. Todos los planes de pago incluyen acceso exclusivo a nuestra Inteligencia Artificial Jurídica.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`relative p-8 rounded-2xl bg-white border-2 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
              plan.popular ? 'border-amber-500 shadow-xl shadow-amber-500/10' : 'border-slate-200 hover:border-slate-300 hover:shadow-lg'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 font-semibold text-sm rounded-full shadow-md">
                Más Popular
              </span>
            )}
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
              {plan.icon}
            </div>
            
            <p className="text-sm text-slate-500 font-medium mb-2">{plan.target}</p>
            
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-black text-slate-900">{plan.price}</span>
              <span className="text-slate-500 font-medium">/mes</span>
            </div>
            
            <p className="text-slate-600 mb-8 border-b border-slate-100 pb-8">{plan.description}</p>
            
            <ul className="flex-1 space-y-4 mb-8">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex flex-row items-start gap-3">
                  <CheckCircle className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-amber-500' : 'text-slate-400'}`} />
                  <span className="text-slate-700">{feat}</span>
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => handleSubscribe(plan.id)}
              className={`w-full py-4 rounded-xl font-bold transition-all ${
                plan.popular 
                  ? 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg' 
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
              }`}
            >
              Elegir Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
