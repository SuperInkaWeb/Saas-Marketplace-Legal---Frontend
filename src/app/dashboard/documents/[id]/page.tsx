"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { documentService } from "@/modules/document/services/documentService";
import { LegalEditor } from "@/modules/document/components/LegalEditor";
import { DocumentGeneratorResponse } from "@/modules/document/types";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function DocumentEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [documentData, setDocumentData] = useState<DocumentGeneratorResponse | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDocument = async () => {
      try {
        setLoading(true);
        const doc = await documentService.getDocument(id as string);
        
        // Adapt DocumentResponse to the format expected by LegalEditor
        setDocumentData({
          documentPublicId: doc.publicId,
          generatedContent: doc.content || "",
          fileName: doc.fileName,
          isDraft: doc.isDraft,
          missingFields: [] // We don't have this info here, but the editor will re-scan if needed
        });
      } catch (error) {
        toast.error("No se pudo cargar el documento");
        router.push("/dashboard/documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Cargando documento profesional...</p>
      </div>
    );
  }

  if (!documentData) return null;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/dashboard/documents"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver a Mis Documentos
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 truncate max-w-2xl">
          Editando: {documentData.fileName}
        </h1>
      </div>

      <div className="bg-slate-50 rounded-3xl p-4 md:p-8 border border-slate-200">
        <LegalEditor 
          documentId={documentData.documentPublicId}
          initialData={documentData}
          onSaved={() => toast.success("Documento actualizado")}
        />
      </div>
    </div>
  );
}
