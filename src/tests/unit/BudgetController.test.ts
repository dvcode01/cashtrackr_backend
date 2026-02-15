import { createRequest, createResponse } from 'node-mocks-http';
import { budgets } from "../mocks/budget";
import { BudgetController } from '../../controllers/BudgetController';
import Budget from '../../models/Budget';

jest.mock('../../models/Budget', () => ({
    findAll: jest.fn()
}));

describe('Get all budgets', () => {
    beforeEach(() => {
        (Budget.findAll as jest.Mock).mockReset();
        (Budget.findAll as jest.Mock).mockImplementation((options) => {
            const updatedBudgets = budgets.filter(budget => budget.user_id === options.where.user_id);
            return Promise.resolve(updatedBudgets);
        });
    });

    it('Should retrieve 2 budgets for user with ID 1', async () => { 
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: {id: 1}
        });

        const res = createResponse();
        await BudgetController.getAll(req, res);
        
        const data = res._getJSONData();
        expect(data).toHaveLength(2);
        
        expect(res.statusCode).toBe(200);
        expect(res.status).not.toBe(404);
    });

    it('Should retrieve 1 budget for user with ID 2', async() => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: {id: 2}
        });

        const res = createResponse();
        await BudgetController.getAll(req, res);
        
        const data = res._getJSONData();
        expect(data).toHaveLength(1);

        expect(res.statusCode).toBe(200);
        expect(res.status).not.toBe(404);
    });

    it('Should retrieve 0 budget for user with ID 10', async() => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: {id: 10}
        });

        const res = createResponse();
        await BudgetController.getAll(req, res);
        
        const data = res._getJSONData();
        expect(data).toHaveLength(0);

        expect(res.statusCode).toBe(200);
        expect(res.status).not.toBe(404);
    });

    it('Should handle errors when fetching budgets', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: {id: 100}
        });

        const res = createResponse();
        (Budget.findAll as jest.Mock).mockRejectedValue(new Error);
        await BudgetController.getAll(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({error: 'There was a mistake'});
    });
});