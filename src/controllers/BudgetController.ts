import { Request, Response } from "express";

export class BudgetController {

    public static getAll = async (req: Request, res: Response) => {
        console.log('desde /api/budgets');
    }

    public static create = async (req: Request, res: Response) => {
        console.log('POST desde /api/budgets');
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
