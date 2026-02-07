import { Request, Response } from "express";
import User from "../models/User";
import { hashPassword } from '../utils/auth';
import { generateToken } from "../utils/token";

export class AuthController {
    public static createAccount = async (req: Request, res: Response) => {
        try {
            const {email, password} = req.body;
            const user = new User(req.body);

            // Prevenir duplicados
            const userExist = await User.findOne({where: {email}});
            
            if(userExist){
                const error = new Error('There is already a user associated with that email address');
                return res.status(409).json({error: error.message});
            }

            user.password = await hashPassword(password);
            user.token = generateToken();

            await user.save();
            res.json('User created successfully');
        } catch (error) {
            res.status(500).json({error: 'There was a mistake'});
        }
    };
}