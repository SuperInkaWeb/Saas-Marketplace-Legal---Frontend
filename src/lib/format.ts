/**
 * Maps document type enum values to human-readable Spanish labels.
 */
const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  ID_CARD: "Cédula de Identidad / DNI",
  PASSPORT: "Pasaporte",
  DRIVER_LICENSE: "Licencia de Conducir",
  BAR_CARD: "Carnet de Colegiatura",
};

export function formatDocumentType(type: string | null | undefined): string {
  if (!type) return "No especificado";
  return DOCUMENT_TYPE_LABELS[type] ?? type;
}
