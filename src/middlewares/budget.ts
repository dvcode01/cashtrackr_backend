import type { Request, Response, NextFunction } from 'express';
import { param, validationResult } from 'express-validator';
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
        const budget = await Budget.findOne({where: {budgetID}});
        
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