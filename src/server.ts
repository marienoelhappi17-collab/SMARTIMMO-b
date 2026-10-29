import dotenv from 'dotenv'
import prisma from "./config/prisma"
import app from './app'

dotenv.config()



const PORT = process.env.PORT ;

const start = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected");
    
    app.listen(PORT, () => {
      console.log(`Our application listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('starting failed', error);
    process.exit(1);
  }
};

start();