import type { Request, Response, NextFunction } from 'express';
import { param, body, validationResult } from 'express-validator';
import Budget from '../models/Budget';

declare global {
    namespace Express {
        interface Request {
            budget?: Budget
        }
    }
}

export const validateBudgetById = async (req: Request, res: Response, next: NextFunction) => {

    await param('budgetID')
            .isInt().withMessage('Invalid ID')
            .custom(value => value > 0).withMessage('Invalid ID')
            .run(req)

    let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
    next();
};

export const validateBudgetExist = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { budgetID } = req.params
        const budget = await Budget.findOne({where: {id: budgetID}});
        
        if(!budget){
            const error = new Error('Budget not found');
            return res.status(404).json({error: error.message});
        }

        req.budget = budget;
        next();
    } catch (error) {
        res.status(500).json({error: 'There was a mistake'});
    }
};

export const validateBudgetInput = async (req: Request, res: Response, next: NextFunction) => {
    await body('name')
            .notEmpty().withMessage('The budget name cannot be empty').run(req)
    await body('amount')
        .notEmpty().withMessage('The budget amount cannot be empty')
        .isNumeric().withMessage('Invalid quantity')
        .custom(value => value > 0).withMessage('The budget must be greater than zero').run(req)

    next();
}