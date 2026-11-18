
import dotenv from "dotenv";
import path from "path";
dotenv.config({
    path: path.join(process.cwd(), ".env")
});

export const envVars = {
    port: process.env.PORT,
    databaseUrl: process.env.DATABASE_URL ,
    appUrl: process.env.APP_URL,
    betterAuthUrl: process.env.BETTER_AUTH_URL,
    betterAuthSecret: process.env.BETTER_AUTH_SECRET,
    googleClientId: process.env.GooGLE_CLIENT_ID,
    googleClientSecret: process.env.Google_CLIENT_SECRET,
}

