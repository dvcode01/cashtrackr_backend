import { Router } from "express";
import { body, param } from 'express-validator';
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middlewares/validation";
import validateBudgetById from "../middlewares/budget";

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
    validateBudgetById,
    BudgetController.getById);

router.put('/:id', 
    validateBudgetById,
    body('name')
        .notEmpty().withMessage('The budget name cannot be empty'),
    body('amount')
        .notEmpty().withMessage('The budget amount cannot be empty')
        .isNumeric().withMessage('Invalid quantity')
        .custom(value => value > 0).withMessage('The budget must be greater than zero'),
    handleInputErrors,
    BudgetController.updateById);


router.delete('/:id',
    validateBudgetById, 
    BudgetController.deleteById);


export default router;