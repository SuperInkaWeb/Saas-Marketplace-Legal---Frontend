export interface DocumentResponse {
  publicId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSizeBytes: number;
  isTemplate: boolean;
  isDraft: boolean;
  content?: string;
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
  matterPublicId?: string;
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
  isValid?: boolean;
  documentPublicId?: string;
  fileName?: string;
  isDraft?: boolean;
}

export interface DocumentUpdateRequest {
  content: string;
}

export interface DocumentFieldDefinition {
  name: string;
  label: string;
  type: "TEXT" | "NUMBER" | "DATE" | "SELECT";
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface TemplatePublicResponse {
  publicId: string;
  name: string;
  code: string;
  jurisdiction: string;
  requiredFields: string;
  fieldDefinitions?: string;
  price: number;
}
