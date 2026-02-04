import { Router } from "express";
import { body, param } from 'express-validator';
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middlewares/validation";

const router = Router();

router.get('/', BudgetController.getAll);

router.post('/', 
    body('name')
        .notEmpty().withMessage('The budget name cannot be empty'),
    body('amount')
        .notEmpty().withMessage('The budget amount cannot be empty')
        .isNumeric().withMessage('Invalid quantity')
        .custom(value => value > 0).withMessage('The budget must be greater than zero'),
    handleInputErrors,
    BudgetController.create);

router.get('/:id', 
    param('id').isInt().withMessage('Invalid ID')
        .custom(value => value > 0).withMessage('Invalid ID'),
    handleInputErrors,
    BudgetController.getById);

router.put('/:id', 
    param('id').isInt().withMessage('Invalid ID')
        .custom(value => value > 0).withMessage('Invalid ID'),
    handleInputErrors,
    body('name')
        .notEmpty().withMessage('The budget name cannot be empty'),
    body('amount')
        .notEmpty().withMessage('The budget amount cannot be empty')
        .isNumeric().withMessage('Invalid quantity')
        .custom(value => value > 0).withMessage('The budget must be greater than zero'),
    handleInputErrors,
    BudgetController.updateById);


router.delete('/:id',
    param('id').isInt().withMessage('Invalid ID')
        .custom(value => value > 0).withMessage('Invalid ID'), 
    handleInputErrors,
    BudgetController.deleteById);


export default router;