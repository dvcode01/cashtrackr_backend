import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middlewares/validation";
import { validateBudgetById, validateBudgetExist, validateBudgetInput } from "../middlewares/budget";
import { ExpensesController } from "../controllers/ExpenseController";
import { validateExpenseById, validateExpenseExist, validateExpenseInput } from "../middlewares/Expense";

const router = Router();

router.param('budgetID', validateBudgetById);
router.param('budgetID', validateBudgetExist);

router.param('expenseID', validateExpenseById);
router.param('expenseID', validateExpenseExist);

router.get('/', BudgetController.getAll);

router.post('/', 
    validateBudgetInput,
    handleInputErrors,
    BudgetController.create);

router.get('/:budgetID', BudgetController.getById);

router.put('/:budgetID', 
    validateBudgetInput,
    handleInputErrors,
    BudgetController.updateById);

router.delete('/:budgetID', BudgetController.deleteById);

/* Routes for Expenses  */
router.get('/:budgetID/expenses', ExpensesController.getAll);

router.post('/:budgetID/expenses', 
    validateExpenseInput,
    handleInputErrors,
    ExpensesController.create);

router.get('/:budgetID/expenses/:expenseID', ExpensesController.getById);
router.put('/:budgetID/expenses/:expenseID', ExpensesController.updateById);
router.delete('/:budgetID/expenses/:expenseID', ExpensesController.deleteById);


export default router;