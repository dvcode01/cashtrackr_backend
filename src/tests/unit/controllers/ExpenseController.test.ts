import { createRequest, createResponse } from 'node-mocks-http';
import Expense from '../../../models/Expense';
import { ExpensesController } from '../../../controllers/ExpenseController';
import { expenses } from '../../mocks/expense';

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

    it('Should handle expense creation errors', async () => {
        const expenseMock = {
            save: jest.fn()
        };
        
        (Expense.create as jest.Mock).mockRejectedValue(new Error);

        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetID/expenses',
            budget: {id: 1},
            body: {name: 'Gasto nuevo', amount: 230}
        });

        const res = createResponse();
        await ExpensesController.create(req, res);
        
        const data = res._getJSONData();

        expect(res.statusCode).toBe(500);
        expect(data).toEqual({error: 'There was a mistake'});

        expect(expenseMock.save).not.toHaveBeenCalled();
        expect(expenseMock.save).toHaveBeenCalledTimes(0);
    });
});

describe('Get expense by ID', () => {
    it('Should return expense with ID 1', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets/:budgetID/expenses/:expenseID',
            expense: expenses[0]
        });

        const res = createResponse();
        await ExpensesController.getById(req, res);

        const data = res._getJSONData();
        
        expect(res.statusCode).toBe(200);
        expect(data).toEqual(expenses[0]);
    });

});

describe('Update expense by ID', () => {
    it('Should handle expense update', async () => {
        const expenseMock = {
            ...expenses[0],
            update: jest.fn().mockResolvedValue(true)
        };

        const req = createRequest({
            method: 'PUT',
            url: '/api/:budgetID/expenses/:expenseID',
            expense: expenseMock,
            body: {name: 'Gasto actualizado', amount: 230}
        });

        const res = createResponse();
        await ExpensesController.updateById(req, res);
        
        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data).toEqual('Expense updated correctly');

        expect(expenseMock.update).toHaveBeenCalled();
        expect(expenseMock.update).toHaveBeenCalledWith(req.body);
    });
});

describe('Delete expense by ID', () => {
    it('Should delete expense and return success message', async () => {
        const expenseMock = {
            ...expenses[0],
            destroy: jest.fn().mockResolvedValue(true)
        };

        const req = createRequest({
            method: 'DELETE',
            url: '/api/:budgetID/expenses/:expenseID',
            expense: expenseMock,
        });

        const res = createResponse();
        await ExpensesController.deleteById(req, res);

        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data).toEqual('Expense successfully removed');

        expect(expenseMock.destroy).toHaveBeenCalled();
        expect(expenseMock.destroy).toHaveBeenCalledTimes(1);
    });
});