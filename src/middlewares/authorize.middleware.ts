import { RequestHandler } from "express";
import { Role } from "../generated/prisma/client";
import { AppError } from "../utils/app-error";

export const authorize =
  (...roles: Role[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError("Accès refusé : rôle insuffisant", 403);
    }
    next();
  };