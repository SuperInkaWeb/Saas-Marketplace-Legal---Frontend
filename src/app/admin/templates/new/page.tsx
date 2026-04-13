"use client";

import { TemplateForm } from "@/modules/admin/components/TemplateForm";
import { adminApi } from "@/modules/admin/api";
import { DocumentTemplateRequest } from "@/modules/admin/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NewTemplatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: DocumentTemplateRequest) => {
    setLoading(true);
    try {
      await adminApi.createTemplate(data);
      toast.success("Plantilla creada correctamente");
      router.push("/admin/templates");
    } catch (error) {
      toast.error("Error al crear la plantilla");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <TemplateForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
