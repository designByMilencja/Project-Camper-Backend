import {Router} from "express";
import {RegistrationRecord} from "../records/registration.record";
import bcrypt from "bcrypt";

export const registrationRouter = Router();
registrationRouter

    .post('/', async (req, res) => {
        console.log(req.body)
        const saltRounds = 10;
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            if (err) {
             throw new Error('błąd serwera')
            } else {
                {
                    const newUser = new RegistrationRecord({
                        ...req.body,
                        password: hash,
                    });
                    newUser.insertNewUser();
                    res.json(newUser)
                }
            }
        });
    })
