import {google} from 'googleapis';
const nodemailer = require('nodemailer');

import {CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN} from "../config/config";


const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);
oAuth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN
});
export const sendVerificationEmail = async (to: string, verificationKey: string) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'projectcamper2023@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken,
            },

        });
        const mailOptions = {
            from: 'ProjectCamper📨<projectcamper2023@gmail.com>',
            to: 'milena.pienkosz1991@gmail.com',
            subject: 'Potwierdzenie rejestracji na stronie Project Camper by Milencja',
            text: `Witaj! Aby aktywować konto, kliknij w poniższy link: http://localhost:3001/registration/verify/${verificationKey}`,
            html: `<h1>Witaj! Aby aktywować konto, kliknij w poniższy link: http://localhost:3001/registration/verify/${verificationKey}</h1>`,
        };
        return await transport.sendMail(mailOptions);
    } catch (err) {
        return err
    }
}
