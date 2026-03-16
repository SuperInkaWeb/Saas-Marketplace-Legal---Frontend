import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Formato de email inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export const clientRegisterSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastNameFather: z.string().min(1, "El apellido paterno es obligatorio"),
  lastNameMother: z.string().min(1, "El apellido materno es obligatorio"),
  email: z.email("Formato de email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  phoneNumber: z.string().optional(),
  companyName: z.string().optional(),
  billingAddress: z.string().optional(),
});

export const lawyerRegisterSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastNameFather: z.string().min(1, "El apellido paterno es obligatorio"),
  lastNameMother: z.string().min(1, "El apellido materno es obligatorio"),
  email: z.email("Formato de email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  phoneNumber: z.string().optional(),
  city: z.string().min(1, "La ciudad es obligatoria"),
  country: z.string().min(1, "El país es obligatorio"),
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
export type ClientRegisterFormData = z.infer<typeof clientRegisterSchema>;
export type LawyerRegisterFormData = z.infer<typeof lawyerRegisterSchema>;
export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;