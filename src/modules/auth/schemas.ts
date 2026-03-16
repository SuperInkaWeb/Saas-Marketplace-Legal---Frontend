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

export type LoginFormData = z.infer<typeof loginSchema>;
export type ClientRegisterFormData = z.infer<typeof clientRegisterSchema>;