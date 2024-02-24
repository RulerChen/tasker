import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import elasticApmNode from 'elastic-apm-node';

dotenv.config({});

if (process.env.ENABLE_APM === '1') {
  elasticApmNode.start({
    serviceName: 'tasker-auth',
    serverUrl: process.env.ELASTIC_APM_SERVER_URL,
    secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
    environment: process.env.NODE_ENV,
    active: true,
    captureBody: 'all',
    errorOnAbortedRequests: true,
    captureErrorLogStackTraces: 'always',
  });
}

class Config {
  constructor() {
    this.API_VERSION = process.env.API_VERSION || 'v1';
    this.JWT_TOKEN = process.env.JWT_TOKEN || '1234';
    this.GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN || '1234';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.API_GATEWAY_URL = process.env.API_GATEWAY_URL || '';
    this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
    this.DATABASE_HOST = process.env.DATABASE_HOST || '';
    this.DATABASE_USER = process.env.DATABASE_USER || '';
    this.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '';
    this.DATABASE_NAME = process.env.DATABASE_NAME || '';
    this.DATABASE_PORT = process.env.DATABASE_PORT || '';
    this.CLOUD_NAME = process.env.CLOUD_NAME || '';
    this.CLOUD_API_KEY = process.env.CLOUD_API_KEY || '';
    this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET || '';
    this.CLUSTER_TYPE = process.env.CLUSTER_TYPE || '';
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
  }

  cloudinaryConfig() {
    cloudinary.v2.config({
      cloud_name: this.CLOUD_NAME,
      api_key: this.CLOUD_API_KEY,
      api_secret: this.CLOUD_API_SECRET,
    });
  }
}

export const config = new Config();
