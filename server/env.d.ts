declare namespace NodeJS {
    interface ProcessEnv {
      MONGO_URL: string;
      PORT: string;
      JWT_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      SESSION_SECRET: string;
    }
  }
  