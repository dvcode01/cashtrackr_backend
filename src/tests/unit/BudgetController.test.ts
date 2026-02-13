import { createRequest, createResponse } from 'node-mocks-http';
import { budgets } from "../mocks/budget";
import { BudgetController } from '../../controllers/BudgetController';
import Budget from '../../models/Budget';

jest.mock('../../models/Budget', () => ({
    findAll: jest.fn()
}));

describe('Get all budgets', () => {
    it('Should retrieve 3 budgets', async () => { 
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: {id: 1}
        });

        const res = createResponse();
        
        (Budget.findAll as jest.Mock).mockResolvedValue(budgets);
        await BudgetController.getAll(req, res);
        
        const data = res._getJSONData();
        console.log(data);
    });
});