import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { handleInputErrors } from '../middlewares/validation';
import { limiter } from '../config/limiter';

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

router.post('/confirm-account', 
    limiter,
    body('token')
        .notEmpty().isLength({min: 6, max: 6}).withMessage('Invalid token'),
    handleInputErrors,
    AuthController.confirmAccount);

router.post('/login', 
    body('email')
        .isEmail().withMessage('Invalid email'),
    body('password')
        .notEmpty().withMessage('The password is required'),
    handleInputErrors,
    AuthController.login);


export default router;