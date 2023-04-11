import {Request, Response, Router} from "express";
import {RegistrationRecord} from "../records/registration.record";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";
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
                    const verificationKey = uuid();
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
                return res.status(404).send('Niestety nie znaleźliśmy Twojego konta w bazie danych, prosimy zarejestruj się ponownie');
            }
            if(user.emailVerified) {
                return res.status(400).send('Twoje konto jest już zweryfikowane, przejdź do logowania na stronie Project Camper');
            }
            user.emailVerified = true;
            await user.updateUser();
            res.redirect('http://localhost:3000/access')
        } catch (error) {
            console.error(error)
            res.status(500).send('Przepraszamy spróbuj ponownie później');
        }
    })

