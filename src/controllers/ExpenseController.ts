import type { Request, Response } from 'express';
import Expense from '../models/Expense';

export class ExpensesController {
  
    public static create = async (req: Request, res: Response) => {
        try {
            const expense = new Expense(req.body);
            expense.budget_id = req.budget.id;

            await expense.save();
            res.status(201).json('Correctly added expense');
        } catch (error) {
            res.status(500).json({error: 'There was a mistake'});
        }
    }
  
    public static getById = async (req: Request, res: Response) => {
        res.json(req.expense);
    }

    public static updateById = async (req: Request, res: Response) => {
        await req.expense.update(req.body);
        res.json('Expense updated correctly');
    }
  
    public static deleteById = async (req: Request, res: Response) => {
        await req.expense.destroy();
        res.json('Expense successfully removed');
    }
}