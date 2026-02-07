import { Request, Response } from "express";
import User from "../models/User";

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

            await user.save();
            res.json('User created successfully');
        } catch (error) {
            res.status(500).json({error: 'There was a mistake'});
        }
    };
}