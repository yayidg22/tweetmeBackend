import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client';
import AuthRouter from './routes/auth.route';
import PostRouter from './routes/post.route';
import cors from 'cors';

export const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3001;

async function main() {
    app.use(express.json());
    app.use(cors());

    // Register API routes
    app.use("/api/v1/auth", AuthRouter);
    app.use("/api/v1/post", PostRouter);

    // Catch unregistered routes
    app.all("*", (req: Request, res: Response) => {
        res.status(404).json({ error: `Route ${req.originalUrl} not found` });
    });
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
}

main()
    .then(async () => {
        await prisma.$connect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });