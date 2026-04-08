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

export interface DocumentGeneratorRequest {
  documentTypeCode: string;
  caseRequestId?: number;
  jurisdiction: string;
  userData: Record<string, any>;
}

export interface DocumentGeneratorResponse {
  generatedContent: string;
  missingFields: string[];
  isValid: boolean;
  documentPublicId?: string;
}

export interface DocumentUpdateRequest {
  content: string;
}

export interface TemplatePublicResponse {
  publicId: string;
  name: string;
  code: string;
  jurisdiction: string;
  requiredFields: string;
}
