import { transport } from "../config/mailer"

type EmailType = {
    email: string,
    name: string,
    token: string
}

export class AuthEmail {
    public static sendConfirmationEmail = async( user: EmailType) => {
        const email = await transport.sendMail({
            from: 'Cashtrackr <admin@cashtrackr.com>',
            to: user.email,
            subject: 'Cashtrackr - Confirma tu cuenta',
            html: `
                <p>Hola ${user.name}! has creado tu cuenta en Cashtrackr, ya esta casi lista</p>
                <p>Visita el siguiente enlace:</p>
                <a href="#">Confirmar Cuenta</a>

                 <p>e ingrese el siguiente código: <b>${user.token}</b></p>
            `
        });
    }
}
