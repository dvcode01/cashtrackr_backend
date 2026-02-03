import { Request, Response } from "express";
import Budget from "../models/Budget";

export class BudgetController {

    public static getAll = async (req: Request, res: Response) => {
        
        try {
            const budgets = await Budget.findAll({
                order: ['createdAt', 'DESC'],
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
        try {
            const { id } = req.params
            const budgetById = await Budget.findOne({where: {id}});
            
            if(!budgetById){
                const error = new Error('Budget not found');
                return res.status(404).json({error: error.message});
            }

            res.json(budgetById);
        } catch (error) {
            res.status(500).json({error: 'There was a mistake'});
        }
    }

    public static updateById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const budget = await Budget.findOne({where: {id}});
            
            if(!budget){
                const error = new Error('Budget not found');
                return res.status(404).json({error: error.message});
            }

            await budget.update(req.body);
            res.json('Budget updated correctly');
        } catch (error) {
            res.status(500).json({error: 'There was a mistake'});
        }
        
    }

    public static deleteById = async (req: Request, res: Response) => {
        console.log('DELETE desde /api/budgets/:id');
    }
}
