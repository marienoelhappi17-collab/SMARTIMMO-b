import { RequestHandler } from "express";
import prisma from "../config/prisma";
import { AppError } from "../utils/app-error";
import { verifyToken } from "../utils/jwt";

export const authenticate: RequestHandler = async (req, _res, next) => {
  const header = req.headers.authorization; // en minuscules dans Node
  if (!header?.startsWith("Bearer ")) {
    throw new AppError("Authentification requise", 401);
  }

  const userId = verifyToken(header.slice(7).trim()); // invalide -> 401

  // Le rôle vient de la base, pas du client
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
  if (!user) {
    throw new AppError("Authentification requise", 401);
  }

  req.user = user;
  next();
};