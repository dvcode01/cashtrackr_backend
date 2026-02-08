import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { handleInputErrors } from '../middlewares/validation';

const router = Router();

router.post('/create-account', 
    body('name')
        .notEmpty().withMessage('The name cannot be empty'),
    body('password')
        .notEmpty().withMessage('The password cannot be empty')
        .isLength({min: 8}).withMessage('The password is very short, it must have minimum of 8 characters'),
    body('email')
        .isEmail().withMessage('Invalid email'),
    handleInputErrors,
    AuthController.createAccount);

router.post('/confirm-account', AuthController.confirmAccount);


export default router;