import api from "@/lib/api";
import { 
  DocumentResponse, 
  UploadDocumentRequest,
  DocumentGeneratorRequest,
  DocumentGeneratorResponse,
  DocumentUpdateRequest,
  TemplatePublicResponse
} from "../types";

const BASE_URL = "/documents";

export const documentService = {
  uploadDocument: async (payload: UploadDocumentRequest): Promise<DocumentResponse> => {
    const { data } = await api.post(BASE_URL, payload);
    return data;
  },

  getMyDocuments: async (): Promise<DocumentResponse[]> => {
    const { data } = await api.get(`${BASE_URL}/me`);
    return data;
  },

  getTemplates: async (): Promise<TemplatePublicResponse[]> => {
    const { data } = await api.get(`${BASE_URL}/templates`);
    return data;
  },

  archiveDocument: async (documentId: string): Promise<void> => {
    await api.delete(`${BASE_URL}/${documentId}`);
  },

  /** Live preview — renders template with data but does NOT save */
  previewDocument: async (payload: DocumentGeneratorRequest): Promise<DocumentGeneratorResponse> => {
    const { data } = await api.post(`${BASE_URL}/preview`, payload);
    return data;
  },

  /** Full generation — renders AND persists as draft */
  generateDocument: async (payload: DocumentGeneratorRequest): Promise<DocumentGeneratorResponse> => {
    const { data } = await api.post(`${BASE_URL}/generate`, payload);
    return data;
  },

  updateDocumentContent: async (documentId: string, payload: DocumentUpdateRequest): Promise<void> => {
    await api.put(`${BASE_URL}/${documentId}/content`, payload);
  },

  getDocument: async (documentId: string): Promise<DocumentResponse> => {
    const { data } = await api.get(`${BASE_URL}/${documentId}`);
    return data;
  },
};
