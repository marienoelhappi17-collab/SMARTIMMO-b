import crypto from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

const sign = (userId: string, secret: string, expiresIn: string) =>
  jwt.sign({}, secret, {
    subject: userId,
    jwtid: crypto.randomUUID(),
    expiresIn: expiresIn as SignOptions["expiresIn"],
  });

const verify = (token: string, secret: string): string => {
  const payload = jwt.verify(token, secret);
  if (typeof payload === "string" || !payload.sub) {
    throw new jwt.JsonWebTokenError("Invalid token payload");
  }
  return payload.sub;
};

export const signAccessToken = (userId: string) =>
  sign(userId, env.JWT_ACCESS_SECRET, env.JWT_ACCESS_EXPIRES);
export const signRefreshToken = (userId: string) =>
  sign(userId, env.JWT_REFRESH_SECRET, env.JWT_REFRESH_EXPIRES);

export const verifyAccessToken = (token: string) => verify(token, env.JWT_ACCESS_SECRET);
export const verifyRefreshToken = (token: string) => verify(token, env.JWT_REFRESH_SECRET);

// Un JWT dépasse 72 octets (limite de bcrypt) : on le stocke haché en SHA-256
export const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");