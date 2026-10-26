import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export const validate =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(result.error); // ZodError -> errorHandler -> 400
    }
    req.body = result.data; // données nettoyées, champs inconnus retirés
    next();
  };