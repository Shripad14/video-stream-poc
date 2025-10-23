import { config } from "dotenv";

// Load appropriate environment variables from .env file
config({path: `.env.${process.env.NODE_ENV || "development"}.local`});

export const {
    PORT
} = process.env;