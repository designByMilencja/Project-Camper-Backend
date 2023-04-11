import {Request, Response, Router} from "express";
import bcrypt from "bcrypt";
import {RegistrationRecord} from "../records/registration.record";
import {CustomSession} from "../types/express.session/express.session";
import jwt from 'jsonwebtoken';
import {secret} from "../utils/db";

export const loginRouter = Router();
loginRouter

    .post('/', async (req: Request, res:Response) => {
        const {login, password} = req.body;
        const user = await RegistrationRecord.getUserByLogin(login);

        if (!user) {
            return res.status(401).json({message: 'Nieprawidłowy login lub hasło'});
        }
        const isMatch = await bcrypt.compare(password as string, user.password);
        if (!isMatch) {
            return res.status(401).json({message: 'Nieprawidłowy login lub hasło'});
        } else {
            const token = jwt.sign({id: user.id}, secret, {expiresIn: '1h'});
            (req.session as CustomSession).token = token;
            res.json({token});
        }
    })
