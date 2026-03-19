"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/modules/auth/store";
import { paymentService } from "@/modules/payment/services/paymentService";
import { PaymentResponse } from "@/modules/payment/types";
import { CreditCard, ArrowUpRight, DollarSign, Wallet, ArrowDownRight, User } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function PaymentsPage() {
  const user = useAuthStore((s) => s.user);
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, [user]);

  const fetchPayments = async () => {
    if (!user || user.role !== "LAWYER") {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await paymentService.getLawyerPayments();
      setPayments(data);
    } catch (error) {
      toast.error("Error al cargar los pagos");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string, classes: string }> = {
      PENDING: { label: "Pendiente", classes: "bg-amber-100 text-amber-800" },
      PROCESSING: { label: "Procesando", classes: "bg-blue-100 text-blue-800" },
      SUCCEEDED: { label: "Completado", classes: "bg-emerald-100 text-emerald-800" },
      FAILED: { label: "Fallido", classes: "bg-red-100 text-red-800" },
      REFUNDED: { label: "Reembolsado", classes: "bg-slate-100 text-slate-800" }
    };
    const b = badges[status] || badges.PENDING;
    return (
      <span className={cn("px-2.5 py-1 text-xs font-semibold rounded-full", b.classes)}>
        {b.label}
      </span>
    );
  };

  if (user?.role !== "LAWYER") {
    return (
      <div className="p-8 max-w-7xl mx-auto flex justify-center py-32">
        <div className="text-center">
          <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900">Acceso Restringido</h2>
          <p className="text-slate-500 mt-2">Tu rol actual no permite visualizar el historial de pagos de servicios.</p>
        </div>
      </div>
    );
  }

  const totalEarnings = payments
    .filter(p => p.status === 'SUCCEEDED')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingEarnings = payments
    .filter(p => p.status === 'PENDING' || p.status === 'PROCESSING')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
          Facturación y Pagos
        </h1>
        <p className="mt-2 text-slate-500 text-sm">Gestiona tus ingresos, métodos de cobro y revisa tu historial de transacciones.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Ingresos Totales</p>
                <h3 className="text-3xl font-bold text-slate-900">${totalEarnings.toLocaleString('es-ES')}</h3>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Por Cobrar (Pendiente)</p>
                <h3 className="text-3xl font-bold text-slate-900">${pendingEarnings.toLocaleString('es-ES')}</h3>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-900 rounded-2xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
              <p className="text-slate-300 text-sm font-medium mb-3">Tu plan actual</p>
              <h3 className="text-2xl font-bold text-white mb-4">Premium</h3>
              <button className="bg-white/10 hover:bg-white/20 text-white transition-colors w-full py-2.5 rounded-lg text-sm font-semibold">
                Gestionar Suscripción
              </button>
            </motion.div>
          </div>

          {/* Transactions list */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Historial de Transacciones</h3>
            </div>
            
            <div className="overflow-x-auto">
              {payments.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <DollarSign className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  No tienes transacciones recientes.
                </div>
              ) : (
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50/50 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                    <tr>
                      <th className="px-6 py-4 rounded-tl-xl">Concepto / Cliente</th>
                      <th className="px-6 py-4">Fecha</th>
                      <th className="px-6 py-4">Monto</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4 rounded-tr-xl text-right">Método</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80">
                    {payments.map((p, idx) => (
                      <motion.tr 
                        key={p.publicId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                              <User className="w-4 h-4 text-slate-500" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{p.clientName}</p>
                              <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {p.publicId.split('-')[0]}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {format(new Date(p.createdAt), "d MMM, yyyy", { locale: es })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                          ${p.amount.toLocaleString('es-ES')} {p.currency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(p.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="text-slate-500 text-xs font-semibold px-2 py-1 rounded bg-slate-100 uppercase">
                            {p.paymentMethod || "CARD"}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
