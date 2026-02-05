import { Request, Response } from "express";
import Budget from "../models/Budget";
import Expense from "../models/Expense";

export class BudgetController {

    public static getAll = async (req: Request, res: Response) => {
        
        try {
            const budgets = await Budget.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
                // TODO: Filtrar por usuario autenticado
            });
            
            res.json(budgets);
        } catch (error) {
            res.status(500).json({error: 'There was a mistake'});
        }
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
        const budget = await Budget.findByPk(req.budget.id, {
            include: [Expense]
        });

        res.json(budget);
    }

    public static updateById = async (req: Request, res: Response) => {
        await req.budget.update(req.body);
        res.json('Budget updated correctly');
    }

    public static deleteById = async (req: Request, res: Response) => {
        await req.budget.destroy();
        res.json('Budget successfully removed');
    }
}
