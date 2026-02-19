import { createRequest, createResponse } from 'node-mocks-http';
import Expense from '../../../models/Expense';
import { validateExpenseExist } from '../../../middlewares/Expense';
import { expenses } from '../../mocks/expense';
import { budgets } from '../../mocks/budget';
import { hasAccess } from '../../../middlewares/budget';

jest.mock('../../../models/Expense', () => ({
    findByPk: jest.fn()
}));

describe('Validates the existence of the expense', () => {
    beforeEach(() => {
        (Expense.findByPk as jest.Mock).mockImplementation((id) => {
            const expense = expenses.filter(exp => exp.id.toString() === id)[0] ?? null;
            return Promise.resolve(expense)
        })
    });
    
    it('Should handle non-existent expense', async () => {
        const req = createRequest({
            params: { expenseID: '120' },
        });

        const res = createResponse();
        const next = jest.fn();

        await validateExpenseExist(req, res, next);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(404);
        expect(data).toEqual({error: 'Expense not found'});
        
        expect(Expense.findByPk).toHaveBeenCalled();
        expect(Expense.findByPk).toHaveBeenCalledTimes(1);
    });

    it('Should call next middleware if expense exists', async () => {
        const req = createRequest({
            params: { expenseID: '1' },
        });

        const res = createResponse();
        const next = jest.fn();

        await validateExpenseExist(req, res, next);
        
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
        expect(req.expense).toEqual(expenses[0])
    });

    it('Should handle internal server error', async () => {
        (Expense.findByPk as jest.Mock).mockRejectedValue(new Error);
        
        const req = createRequest({
            params: { expenseID: '1' },
        });

        const res = createResponse();
        const next = jest.fn();

        await validateExpenseExist(req, res, next);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(500);
        expect(data).toEqual({error: 'There was a mistake'});
    
        expect(next).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(0);
    });

    it('Should prevent unauthorized users from adding expenses', async () => {
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetID/expenses/:expenseID',
            budget: budgets[0],
            user: { id: 20 },
            body: { name: 'expense test', amount: 240 }
        });

        const res = createResponse();
        const next = jest.fn();

        hasAccess(req, res, next);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(401);
        expect(data).toEqual({error: 'Invalid action'});

        expect(next).not.toHaveBeenCalled();
        
    });
});