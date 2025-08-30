/* eslint-env node */
/* eslint-disable no-undef */
import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
      DB_URI, 
    NODE_ENV, JWT_SECRET,
    JWT_EXPIRES_IN,
    ARCJET_ENV, ARCJET_KEY,
    QSTASH_TOKEN, QSTASH_URL,
    SERVER_URL, EMAIL_PASSWORD
 } = process.env;

export const PORT = process.env.PORT || 8000;

