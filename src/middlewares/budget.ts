import type { Request, Response, NextFunction } from 'express';
import { param, validationResult } from 'express-validator';

const validateBudgetById = async (req: Request, res: Response, next: NextFunction) => {

    await param('id')
            .isInt().withMessage('Invalid ID')
            .custom(value => value > 0).withMessage('Invalid ID')
            .run(req)

    let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
    next();
};

export default validateBudgetById;