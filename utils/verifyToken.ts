import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {secret} from "./config.db";

interface DecodedToken {
    userId: string;
}
interface RequestWithUserId extends Request {
    userId?: string;
}

export const verifyToken = (req: RequestWithUserId, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Brak autoryzacji.' });
    }

    try {
        const decoded = jwt.verify(token, secret) as DecodedToken;
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Nieprawidłowy token autoryzacyjny.' });
    }
}
