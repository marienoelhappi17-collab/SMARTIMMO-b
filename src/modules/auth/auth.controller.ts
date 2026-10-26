import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/app-error";
import { signToken } from "../../utils/jwt";
import {
  ChangePasswordInput,
  CreateLocataireInput,
  LoginInput,
  RegisterInput,
} from "./schemas/auth.schemas";

const SALT_ROUNDS = 10;

// Colonnes autorisées à sortir : jamais passwordHash
const publicUser = {
  id: true,
  nom: true,
  email: true,
  telephone: true,
  role: true,
  createdAt: true,
} as const;

export const register = async (req: Request, res: Response) => {
  const { nom, email, telephone, password, role } = req.body as RegisterInput;
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // E-mail déjà pris -> Prisma P2002 -> errorHandler -> 409
  const user = await prisma.user.create({
    data: { nom, email, telephone, passwordHash, role },
    select: publicUser,
  });

  res.status(201).json({ success: true, message: "Compte créé", data: user });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginInput;
  const user = await prisma.user.findUnique({ where: { email } });

  // Même message que l'e-mail ou le mot de passe soit faux
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError("Identifiants incorrects", 401);
  }

  const token = signToken(user.id);
  res.json({
    success: true,
    message: "Connexion réussie",
    data: {
      token,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        telephone: user.telephone,
        role: user.role,
      },
    },
  });
};

export const me = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: publicUser,
  });
  if (!user) throw new AppError("Utilisateur introuvable", 404);

  res.json({ success: true, message: "Utilisateur courant", data: user });
};

export const changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body as ChangePasswordInput;
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) throw new AppError("Utilisateur introuvable", 404);

  if (!(await bcrypt.compare(oldPassword, user.passwordHash))) {
    // 400 et non 401 : le front déconnecte l'utilisateur sur une 401
    throw new AppError("Ancien mot de passe incorrect", 400);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(newPassword, SALT_ROUNDS) },
  });

  res.json({ success: true, message: "Mot de passe modifié" });
};

// Réservé au bailleur : crée un compte LOCATAIRE
export const createLocataire = async (req: Request, res: Response) => {
  const { nom, email, telephone, password } = req.body as CreateLocataireInput;

  const user = await prisma.user.create({
    data: {
      nom,
      email,
      telephone,
      passwordHash: await bcrypt.hash(password, SALT_ROUNDS),
      role: "LOCATAIRE",
    },
    select: publicUser,
  });

  res.status(201).json({ success: true, message: "Locataire créé", data: user });
};
