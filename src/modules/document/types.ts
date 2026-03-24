export interface DocumentResponse {
  publicId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSizeBytes: number;
  isTemplate: boolean;
  price: number;
  signatureStatus: string;
  isArchived: boolean;
  createdAt: string;
}

export interface UploadDocumentRequest {
  fileName: string;
  fileUrl: string;
  fileType?: string;
  fileSizeBytes?: number;
  isTemplate?: boolean;
  price?: number;
}
