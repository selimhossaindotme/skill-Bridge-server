import app from "./app";
import { envVars } from "./config";
import { prisma } from "./lib/prisma";

const PORT = envVars.port|| 5000;

async function startServer(){
    try {
        
        await prisma.$connect();
        console.log("Connected to the database");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
}

startServer();