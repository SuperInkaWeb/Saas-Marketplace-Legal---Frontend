"use client";

import { useState } from "react";
import { useAdminUsers, useUpdateAccountStatus } from "@/modules/admin/hooks";
import { motion } from "framer-motion";
import {
  Search,
  Loader2,
  ShieldCheck,
  ShieldBan,
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);

  const { data, isLoading } = useAdminUsers({
    search: search || undefined,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
    page,
    size: 15,
  });

  const updateStatus = useUpdateAccountStatus();

  const handleToggleStatus = async (publicId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    const action = newStatus === "BLOCKED" ? "bloquear" : "activar";

    if (!confirm(`¿Seguro que deseas ${action} esta cuenta?`)) return;

    try {
      await updateStatus.mutateAsync({
        publicId,
        body: { accountStatus: newStatus },
      });
      toast.success(`Cuenta ${newStatus === "BLOCKED" ? "bloqueada" : "activada"} exitosamente.`);
    } catch {
      toast.error("Error al actualizar el estado de la cuenta.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header */}
      <div className="bg-slate-900 px-6 pt-12 pb-20 lg:px-10 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-blue-300 text-xs font-medium mb-4 backdrop-blur-md">
              <UsersIcon className="w-3.5 h-3.5" />
              Gestión de Usuarios
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Usuarios
            </h1>
            <p className="text-slate-300 mt-2 text-lg">
              Busca, filtra y gestiona todas las cuentas de la plataforma.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 -mt-10 relative z-20 space-y-6">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4 text-slate-500 text-sm font-semibold">
            <Filter className="w-4 h-4" />
            Filtros
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="">Todos los Roles</option>
              <option value="LAWYER">Abogado</option>
              <option value="CLIENT">Cliente</option>
              <option value="ADMIN">Admin</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="">Todos los Estados</option>
              <option value="ACTIVE">Activo</option>
              <option value="BLOCKED">Bloqueado</option>
              <option value="PENDING">Pendiente</option>
            </select>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden"
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
          ) : !data || data.content.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <UsersIcon className="w-10 h-10 mx-auto text-slate-200 mb-3" />
              <p>No se encontraron usuarios con los filtros seleccionados.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Usuario</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rol</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Verificado</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Registro</th>
                      <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/60">
                    {data.content.map((user) => (
                      <tr key={user.publicId} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-slate-900">{user.fullName}</p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-1 rounded-lg text-xs font-bold",
                            user.role === "LAWYER" ? "bg-emerald-100 text-emerald-700" :
                            user.role === "ADMIN" ? "bg-purple-100 text-purple-700" :
                            "bg-blue-100 text-blue-700"
                          )}>
                            {user.role === "LAWYER" ? "Abogado" : user.role === "ADMIN" ? "Admin" : "Cliente"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-1 rounded-lg text-xs font-bold",
                            user.accountStatus === "ACTIVE" ? "bg-green-100 text-green-700" :
                            user.accountStatus === "BLOCKED" ? "bg-red-100 text-red-700" :
                            "bg-amber-100 text-amber-700"
                          )}>
                            {user.accountStatus === "ACTIVE" ? "Activo" : user.accountStatus === "BLOCKED" ? "Bloqueado" : "Pendiente"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {user.isVerified ? (
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                          {format(new Date(user.createdAt), "dd MMM yyyy", { locale: es })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {user.role !== "ADMIN" && (
                            <button
                              onClick={() => handleToggleStatus(user.publicId, user.accountStatus)}
                              disabled={updateStatus.isPending}
                              className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors",
                                user.accountStatus === "ACTIVE"
                                  ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                                  : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                              )}
                            >
                              {user.accountStatus === "ACTIVE" ? (
                                <><ShieldBan className="w-3.5 h-3.5" /> Bloquear</>
                              ) : (
                                <><ShieldCheck className="w-3.5 h-3.5" /> Activar</>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/30">
                <p className="text-xs text-slate-500 font-medium">
                  Mostrando {data.number * data.size + 1} - {Math.min((data.number + 1) * data.size, data.totalElements)} de {data.totalElements}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={data.first}
                    className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-slate-700 px-3">
                    {data.number + 1} / {data.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={data.last}
                    className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
