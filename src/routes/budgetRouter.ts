import { Router, Request, Response} from "express";

const router = Router();

router.get('/', (req: Request, res: Response) => {
    console.log('desde /api/budgets');
})


export default router;