"use client";

import { useEffect, useState, use } from "react";
import { TemplateForm } from "@/modules/admin/components/TemplateForm";
import { adminApi } from "@/modules/admin/api";
import { DocumentTemplateRequest, DocumentTemplateResponse } from "@/modules/admin/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Scale } from "lucide-react";

export default function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [template, setTemplate] = useState<DocumentTemplateResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTemplate();
  }, [id]);

  const fetchTemplate = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getTemplate(id);
      setTemplate(data);
    } catch (error) {
      toast.error("Error al cargar la plantilla");
      router.push("/admin/templates");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: DocumentTemplateRequest) => {
    setSaving(true);
    try {
      await adminApi.updateTemplate(id, data);
      toast.success("Plantilla actualizada correctamente");
      router.push("/admin/templates");
    } catch (error) {
      toast.error("Error al actualizar la plantilla");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !template) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Scale className="w-12 h-12 text-emerald-500 animate-pulse" />
      </div>
    );
  }

  const initialData: DocumentTemplateRequest = {
    name: template.name,
    code: template.code,
    jurisdiction: template.jurisdiction,
    content: template.content,
    requiredFields: template.requiredFields,
    fieldDefinitions: template.fieldDefinitions || "",
    isActive: template.isActive,
  };

  return (
    <div className="p-6 md:p-8">
      <TemplateForm initialData={initialData} onSubmit={handleSubmit} loading={saving} />
    </div>
  );
}
