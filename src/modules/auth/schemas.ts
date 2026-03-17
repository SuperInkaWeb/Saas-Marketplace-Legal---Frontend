import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Formato de email inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastNameFather: z.string().min(1, "El apellido paterno es obligatorio"),
  lastNameMother: z.string().min(1, "El apellido materno es obligatorio"),
  email: z.email("Formato de email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  phoneNumber: z.string().optional(),
});

const roles = ["CLIENT", "LAWYER"] as const;

export const selectRoleSchema = z.object({
  role: z.enum(roles, {
    message: "Debes seleccionar un rol",
  }),
});

export const clientProfileSchema = z.object({
  companyName: z.string().optional(),
  billingAddress: z.string().optional(),
});

export const lawyerProfileSchema = z.object({
  city: z.string().min(1, "La ciudad es obligatoria"),
  country: z.string().min(1, "El país es obligatorio"),
});

export const kycDocumentSchema = z.object({
  documentType: z.string().min(1, "El tipo de documento es obligatorio"),
  documentNumber: z.string().min(1, "El número de documento es obligatorio"),
  documentCountryCode: z.string().min(1, "El código de país es obligatorio"),
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "El código debe tener 6 dígitos"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Formato de email inválido"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "El código debe tener 6 dígitos"),
  newPassword: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type SelectRoleFormData = z.infer<typeof selectRoleSchema>;
export type ClientProfileFormData = z.infer<typeof clientProfileSchema>;
export type LawyerProfileFormData = z.infer<typeof lawyerProfileSchema>;
export type KycDocumentFormData = z.infer<typeof kycDocumentSchema>;
export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;