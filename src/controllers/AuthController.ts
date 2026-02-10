import { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from '../utils/auth';
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

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
        const { email, password } = req.body;
        const user = await User.findOne({ where: {email} });

        if(!user){
            const error = new Error('User not found');
            return res.status(404).json({error: error.message});
        }

        if(!user.confirmed){
            const error = new Error('User not confirmed');
            return res.status(403).json({error: error.message});
        }

        const isPasswordCorrect = await checkPassword(password, user.password);
        
        if(!isPasswordCorrect){
            const error = new Error('Incorrect password');
            return res.status(401).json({error: error.message});
        }

        const token = generateJWT(user.id);
        res.json(token);
    };

    public static forgotPassword = async (req: Request, res: Response) => {
        const { email } = req.body;
        const user = await User.findOne({ where: {email} });

        if(!user){
            const error = new Error('User not found');
            return res.status(404).json({error: error.message});
        }

        user.token = generateToken();
        await user.save();

        await AuthEmail.sendConfirmationEmail({
            email: user.email,
            name: user.name,
            token: user.token
        });

        res.json('Check your email for instructions');
    }

    public static validateToken = async (req: Request, res: Response) => {
        const { token  } = req.body;
        const tokenExist = await User.findOne({ where: {token} });

        if(!tokenExist){
            const error = new Error('Invalid token');
            return res.status(404).json({error: error.message});
        }

        res.json('Valid Token... ');
    };

    public static resetPasswordWithToken = async (req: Request, res: Response) => {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User.findOne({ where: {token} });

        if(!user){
            const error = new Error('Invalid token');
            return res.status(404).json({error: error.message});
        }

        user.password = await hashPassword(password);
        user.token = null;
        
        await user.save();
        res.json('The password was changed successfully');
    };

    public static user = async (req: Request, res: Response) => {
        res.json('Desde user');
    };
}