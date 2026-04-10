import { MatterEventResponse, MatterEventType } from "../types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  FileText, MessageSquare, AlertCircle, Calendar, 
  Scale, ClipboardCheck, Info, Paperclip 
} from "lucide-react";
import { motion } from "framer-motion";

interface MatterTimelineProps {
  events: MatterEventResponse[];
}

export const MatterTimeline = ({ events }: MatterTimelineProps) => {
  const getEventIcon = (type: MatterEventType) => {
    switch (type) {
      case 'HEARING': return <Scale className="w-4 h-4" />;
      case 'FILING': return <FileText className="w-4 h-4" />;
      case 'NOTIFICATION': return <AlertCircle className="w-4 h-4" />;
      case 'MEETING': return <Calendar className="w-4 h-4" />;
      case 'EVIDENCE': return <ClipboardCheck className="w-4 h-4" />;
      case 'NOTE': return <MessageSquare className="w-4 h-4" />;
      case 'SENTENCE': return <Scale className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: MatterEventType) => {
    switch (type) {
      case 'HEARING': return 'bg-indigo-100 text-indigo-600 border-indigo-200';
      case 'FILING': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'NOTIFICATION': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'SENTENCE': return 'bg-rose-100 text-rose-600 border-rose-200';
      case 'EVIDENCE': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  if (events.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
           <Calendar className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-slate-500 font-medium">Aún no hay actuaciones registradas en este expediente.</p>
      </div>
    );
  }

  return (
    <div className="relative pl-8 space-y-8 before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-slate-100">
      {events.map((event, index) => (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          key={event.publicId} 
          className="relative"
        >
          {/* Timeline Dot/Icon */}
          <div className={`absolute -left-11 top-0 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-sm z-10 ${getEventColor(event.eventType)}`}>
            {getEventIcon(event.eventType)}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="font-bold text-slate-900">{event.title}</h4>
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  {format(new Date(event.eventDate), "dd 'de' MMMM, yyyy", { locale: es })}
                </p>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                REGISTRADO {format(new Date(event.createdAt), "HH:mm")}
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {event.description || "Sin descripción proporcionada."}
            </p>

            {event.documentPublicId && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group cursor-pointer hover:border-indigo-200 hover:bg-white transition-all">
                <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 shadow-sm">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 truncate max-w-[200px]">{event.documentName}</p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Paperclip className="w-2.5 h-2.5" /> Documento adjunto
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
