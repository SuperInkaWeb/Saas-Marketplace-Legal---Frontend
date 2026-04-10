import { MatterTaskResponse } from "../types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  CheckCircle2, Circle, Clock, AlertCircle, 
  ChevronRight, Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MatterTaskListProps {
  tasks: MatterTaskResponse[];
  onToggleStatus: (publicId: string) => void;
}

export const MatterTaskList = ({ tasks, onToggleStatus }: MatterTaskListProps) => {
  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !isCompleted;
  };

  if (tasks.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
           <CheckCircle2 className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-slate-500 font-medium">Todas las tareas están al día. ¡Buen trabajo!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {tasks.map((task) => {
          const isCompleted = task.status === 'DONE';
          const overdue = !isCompleted && task.dueDate && new Date(task.dueDate) < new Date();

          return (
            <motion.div
              layout
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={task.publicId}
              className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${isCompleted ? 'bg-slate-50/50 border-slate-100 opacity-60' : 'bg-white border-slate-200 shadow-sm hover:border-indigo-200 shadow-indigo-100/10'}`}
            >
              <button 
                onClick={() => onToggleStatus(task.publicId)}
                className={`mt-1 transition-transform active:scale-90 ${isCompleted ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-500'}`}
              >
                {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
              </button>

              <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-sm ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                  {task.title}
                </h4>
                {task.description && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>
                )}
                
                <div className="flex items-center gap-4 mt-3">
                  {task.dueDate && (
                    <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${overdue ? 'text-rose-500' : 'text-slate-400'}`}>
                      <Calendar className="w-3 h-3" />
                      Vence {format(new Date(task.dueDate), "dd MMM", { locale: es })}
                    </div>
                  )}
                  {isCompleted && task.completedAt && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3" />
                      Completado {format(new Date(task.completedAt), "dd MMM", { locale: es })}
                    </div>
                  )}
                </div>
              </div>

              {!isCompleted && overdue && (
                <div className="px-2 py-1 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-1 animate-pulse">
                  <AlertCircle className="w-3 h-3 text-rose-500" />
                  <span className="text-[10px] font-bold text-rose-600 uppercase">Vencido</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
