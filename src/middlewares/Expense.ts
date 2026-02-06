import type { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import Expense from '../models/Expense';

declare global {
    namespace Express {
        interface Request {
            expense?: Expense
        }
    }
}

export const validateExpenseInput = async (req: Request, res: Response, next: NextFunction) => {
    await body('name')
            .notEmpty().withMessage('The expense name cannot be empty').run(req)
    await body('amount')
        .notEmpty().withMessage('The expense amount cannot be empty')
        .isNumeric().withMessage('Invalid quantity')
        .custom(value => value > 0).withMessage('The expense must be greater than zero').run(req)

    next();
}

export const validateExpenseById = async (req: Request, res: Response, next: NextFunction) => {

    await param('expenseID').isInt().custom(value => value > 0)
            .withMessage('Invalid ID')
            .run(req)

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    next();
};

export const validateExpenseExist = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { expenseID } = req.params
        const expense = await Expense.findOne({where: {id: expenseID}});
        
        if(!expense){
            const error = new Error('Expense not found');
            return res.status(404).json({error: error.message});
        }

        req.expense = expense;
        next();
    } catch (error) {
        res.status(500).json({error: 'There was a mistake'});
    }
};