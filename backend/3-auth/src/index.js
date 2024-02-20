import express from 'express';
import { databaseConnection } from './model/db.js';
import { start } from './server.js';
import { config } from './config.js';

function initialize() {
  config.cloudinaryConfig();
  const app = express();
  databaseConnection();
  start(app);
}

initialize();
