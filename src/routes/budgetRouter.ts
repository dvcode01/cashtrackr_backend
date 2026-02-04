import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middlewares/validation";
import { validateBudgetById, validateBudgetExist, validateBudgetInput } from "../middlewares/budget";

const router = Router();

router.param('budgetID', validateBudgetById);
router.param('budgetID', validateBudgetExist);

router.get('/', BudgetController.getAll);

router.post('/', 
    validateBudgetInput,
    handleInputErrors,
    BudgetController.create);

router.get('/budgetID', BudgetController.getById);

router.put('/budgetID', 
    validateBudgetInput,
    handleInputErrors,
    BudgetController.updateById);

router.delete('/budgetID', BudgetController.deleteById);


export default router;