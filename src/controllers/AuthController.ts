import { Request, Response } from "express";
import User from "../models/User";
import { hashPassword } from '../utils/auth';
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";

export class AuthController {
    public static createAccount = async (req: Request, res: Response) => {
        const {email, password} = req.body;

        // Prevenir duplicados
        const userExist = await User.findOne({where: {email}});
        
        if(userExist){
            const error = new Error('There is already a user associated with that email address');
            return res.status(409).json({error: error.message});
        }
        
        try {
            const user = new User(req.body);
            user.password = await hashPassword(password);
            user.token = generateToken();

            await user.save();
            await AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: user.token
            });

            res.json('User created successfully');
        } catch (error) {
            res.status(500).json({error: 'There was a mistake'});
        }
    };

    public static confirmAccount = async(req: Request, res: Response) => {
        const { token } = req.body;
        const user = await User.findOne({ where: {token} });

        if(!user){
            const error = new Error('Invalid token');
            res.status(409).json({error: error.message});
        }

        user.token = null;
        user.confirmed = true;

        await user.save();
        res.json('Account successfully confirmed');
    };

    public static login = async (req: Request, res: Response) => {
        res.json(req.body);
    };
}