import { Request, Response } from "express";

export class AuthController {
    public static createAccount = (req: Request, res: Response) => {
        res.json('Desde create account');
    };
}