import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { Prisma } from "../generated/prisma/client";
import { AppError } from "../utils/app-error";

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} introuvable`, 404));
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Zod -> 400
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation échouée",
      errors: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // Erreurs voulues (401, 403, 404...)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { errors: err.details } : {}),
    });
  }

  // E-mail déjà utilisé (contrainte @unique) -> 409
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "Cet e-mail est déjà utilisé",
    });
  }

  // JWT invalide ou expiré -> 401 (TokenExpiredError en hérite)
  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({ success: false, message: "Jeton invalide ou expiré" });
  }

  // JSON mal formé envoyé par le client
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ success: false, message: "Corps JSON mal formé" });
  }

  // Tout le reste -> 500, SANS la pile (règle du sujet)
  console.error("[ERREUR INATTENDUE]", err);
  return res.status(500).json({ success: false, message: "Erreur interne du serveur" });
};