declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      PORT: string;
      NODE_ENV: string;
      CLIENT_URL: string;
      SENDER_EMAIL: string;
      SENDER_EMAIL_PASSWORD: string;
      RABBITMQ_ENDPOINT: string;
      ELASTIC_SEARCH_URL: string;
      ELASTIC_APM_SERVER_URL: string;
      ELASTIC_APM_SECRET_TOKEN: string;
    }
  }
}

export {};
