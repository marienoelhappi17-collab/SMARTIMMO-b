import app from "./app";
import prisma from "./config/prisma";
import { env } from "./config/env";

const start = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected");
    app.listen(env.PORT, () => {
      console.log(`Server listening on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

start();