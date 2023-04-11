import {Request, Response, Router} from "express";
import {RegistrationRecord} from "../records/registration.record";
import bcrypt from "bcrypt";
import {sendVerificationEmail} from "../utils/sendVerificationEmail";

export const registrationRouter = Router();
registrationRouter

    .post('/', async (req: Request, res: Response) => {
        const saltRounds = 10;
        bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
            if (err) {
                throw new Error('błąd serwera')
            } else {
                {
                    const verificationKey = await bcrypt.genSalt(10);
                    const newUser = new RegistrationRecord({
                        ...req.body,
                        password: hash,
                        verificationKey,
                    });
                    console.log(newUser)
                    console.log(verificationKey)
                    try {
                        const user = await newUser.insertNewUser();
                        await sendVerificationEmail(user.email, verificationKey);
                        res.status(200).send('Wysłano link');
                    } catch (error) {
                        console.error(error)
                        res.status(500).send('Błąd serwera');
                    }
                }
            }
        });
    })
    .get('/verify/:key', async (req:Request, res:Response)=> {
        try{
            const {key} = req.params;
            const user = await RegistrationRecord.getUserByKey(key);
            if(!user) {
                return res.status(404).send('Nie znaleziono użytkownika');
            }
            if(user.emailVerified) {
                return res.status(400).send('Użytkownik jest już zweryfikowany');
            }
            user.emailVerified = true;
            await user.updateUser();
            return res.status(200).send('Użytkownik zweryfikowany');
        } catch (error) {
            console.error(error)
            res.status(500).send('Błąd serwera');
        }
    })

