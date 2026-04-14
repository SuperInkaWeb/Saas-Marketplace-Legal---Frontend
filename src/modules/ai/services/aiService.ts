import api from "@/lib/api";
import { toast } from "sonner";

export interface ChatResponse {
  sessionPublicId: string;
  responseMessage: string;
}

export interface DocumentAnalysisResponse {
  analysisResult: string;
}

export const aiService = {
  chat: async (message: string, sessionPublicId?: string): Promise<ChatResponse> => {
    try {
      const response = await api.post("/ai/chat", { message, sessionPublicId });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
         throw new Error("REQUIRES_UPGRADE");
      }
      throw error;
    }
  },

  analyzeDocument: async (file: File): Promise<DocumentAnalysisResponse> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/ai/analyze-document", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
         throw new Error("REQUIRES_UPGRADE");
      }
      throw error;
    }
  }
};
