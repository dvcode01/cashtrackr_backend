import type { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';

export const validateExpenseInput = async (req: Request, res: Response, next: NextFunction) => {
    await body('name')
            .notEmpty().withMessage('The expense name cannot be empty').run(req)
    await body('amount')
        .notEmpty().withMessage('The expense amount cannot be empty')
        .isNumeric().withMessage('Invalid quantity')
        .custom(value => value > 0).withMessage('The expense must be greater than zero').run(req)

    next();
}