import { Router } from "express";
import { body } from 'express-validator';
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middlewares/validation";
import { validateBudgetById, validateBudgetExist  } from "../middlewares/budget";

const router = Router();

router.param('budgetID', validateBudgetById);
router.param('budgetID', validateBudgetExist);

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

router.get('/budgetID', BudgetController.getById);

router.put('/budgetID', 
    body('name')
        .notEmpty().withMessage('The budget name cannot be empty'),
    body('amount')
        .notEmpty().withMessage('The budget amount cannot be empty')
        .isNumeric().withMessage('Invalid quantity')
        .custom(value => value > 0).withMessage('The budget must be greater than zero'),
    handleInputErrors,
    BudgetController.updateById);

router.delete('/budgetID', BudgetController.deleteById);


export default router;