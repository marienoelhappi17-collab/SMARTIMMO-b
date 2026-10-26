import { z } from "zod";

const telephone = z
  .string()
  .trim()
  .regex(/^\+?[0-9]{8,15}$/, "Téléphone invalide (8 à 15 chiffres)");

// Inscription publique : SEUL le rôle BAILLEUR est accepté
export const registerSchema = z.object({
  nom: z.string().trim().min(1, "Le nom est obligatoire"),
  email: z.email("E-mail invalide").toLowerCase(),
  telephone,
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  role: z.enum(["BAILLEUR"]).default("BAILLEUR"),
});

export const loginSchema = z.object({
  email: z.email("E-mail invalide").toLowerCase(),
  password: z.string().min(1, "Le mot de passe est obligatoire"),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "L'ancien mot de passe est obligatoire"),
  newPassword: z.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères"),
});

// Création d'un locataire par le bailleur (mot de passe provisoire)
export const createLocataireSchema = z.object({
  nom: z.string().trim().min(1, "Le nom est obligatoire"),
  email: z.email("E-mail invalide").toLowerCase(),
  telephone,
  password: z.string().min(8, "Le mot de passe provisoire doit contenir au moins 8 caractères"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type CreateLocataireInput = z.infer<typeof createLocataireSchema>;