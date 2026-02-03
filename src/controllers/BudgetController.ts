import { Request, Response } from "express";
import Budget from "../models/Budget";

export class BudgetController {

    public static getAll = async (req: Request, res: Response) => {
        console.log('desde /api/budgets');
    }

    public static create = async (req: Request, res: Response) => {
        try {

            const budget = new Budget(req.body);
            
            await budget.save();
            res.status(201).json('Budget Created Correctly');
        } catch (error) {
            res.status(500).json({error: 'There was a mistake'});
        }

    }

    public static getById = async (req: Request, res: Response) => {
        console.log('desde /api/budgets/:id');
    }

    public static updateById = async (req: Request, res: Response) => {
        console.log('PUT desde /api/budgets/:id');
    }

    public static deleteById = async (req: Request, res: Response) => {
        console.log('DELETE desde /api/budgets/:id');
    }
}
