import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY as string;

interface UserIDJwtPayload extends JwtPayload {
    id: number
}

 const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('bearer ', '');
        if (!token) {
            throw new Error();
        }
        const { id } = <UserIDJwtPayload>jwt.verify(token, SECRET_KEY);
        res.locals.userId = id;
        next();
    } catch (err) {
        res.status(401).send('Please authenticate');
    }
};

export default auth;