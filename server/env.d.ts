declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_URL: string;
    PORT: string;
    JWT_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    SESSION_SECRET: string;
    BUCKET_NAME: string;
    BUCKET_REGION: string;
    ACCESS_KEY: string;
    SECRET_ACCESS_KEY: string;
  }
}

import { IUser } from "../models/user"; // Actualizează calea relativă corespunzător

declare global {
  namespace Express {
    interface Request {
      isAuthenticated?: boolean;
      user?: IUser;
    }
  }
}
