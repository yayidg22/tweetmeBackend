import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = "cf0d574bd8764c2b758d3b9d9a1d9ac9c4b8867f174046205915b9ebc67cfed31587d0";

interface UserIDJwtPayload extends JwtPayload {
    id: number
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
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