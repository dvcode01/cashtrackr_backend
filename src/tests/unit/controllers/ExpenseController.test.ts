import { createRequest, createResponse } from 'node-mocks-http';
import Expense from '../../../models/Expense';
import { ExpensesController } from '../../../controllers/ExpenseController';

jest.mock('../../../models/Expense', () => ({
    create: jest.fn()
}));

describe('Creating expense', () => {
    it('Should a create new expense', async() => {
        const expenseMock = {
            save: jest.fn().mockResolvedValue(true)
        };
        
        (Expense.create as jest.Mock).mockResolvedValue(expenseMock);

        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetID/expenses',
            budget: {id: 1},
            body: {name: 'Gasto nuevo', amount: 230}
        });

        const res = createResponse();
        await ExpensesController.create(req, res);
        
        const data = res._getJSONData();

        expect(res.statusCode).toBe(201);
        expect(data).toEqual('Correctly added expense');

        expect(expenseMock.save).toHaveBeenCalled();
        expect(expenseMock.save).toHaveBeenCalledTimes(1);
        expect(Expense.create).toHaveBeenCalledWith(req.body);
    });
});