import api from "@/lib/api";
import { DocumentResponse, UploadDocumentRequest } from "../types";

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

  getTemplates: async (): Promise<DocumentResponse[]> => {
    const { data } = await api.get(`${BASE_URL}/templates`);
    return data;
  },

  archiveDocument: async (documentId: string): Promise<void> => {
    await api.delete(`${BASE_URL}/${documentId}`);
  }
};
