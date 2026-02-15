import { createRequest, createResponse } from 'node-mocks-http';
import { budgets } from "../mocks/budget";
import { BudgetController } from '../../controllers/BudgetController';
import Budget from '../../models/Budget';
import Expense from '../../models/Expense';

jest.mock('../../models/Budget', () => ({
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
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

describe('Creating budgets', () => {
    it('Should create a new Budget and respond with statusCode 201', async () => {
        const mockBudget = {
            save: jest.fn().mockResolvedValue(true)
        };
        (Budget.create as jest.Mock).mockResolvedValue(mockBudget);
        
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets',
            user: {id: 2},
            body: { name: 'Presupuesto prueba', amount: 120}
        });

        const res = createResponse();
        await BudgetController.create(req, res);

        const data = res._getJSONData();
        expect(res.statusCode).toBe(201);

        expect(data).toBe('Budget Created Correctly');
        expect(mockBudget.save).toHaveBeenCalled();

        expect(mockBudget.save).toHaveBeenCalledTimes(1);
        expect(Budget.create).toHaveBeenCalledWith(req.body);
    });

    it('Should handle budget creation error', async () => {
        const mockBudget = {
            save: jest.fn()
        };
        (Budget.create as jest.Mock).mockRejectedValue(new Error);
        
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets',
            user: {id: 2},
            body: { name: '', amount: 120}
        });

        const res = createResponse();
        await BudgetController.create(req, res);

        const data = res._getJSONData();
        expect(res.statusCode).toBe(500);

        expect(data).toEqual({error: 'There was a mistake'});
        expect(mockBudget.save).not.toHaveBeenCalled();
        expect(Budget.create).toHaveBeenCalledWith(req.body);
    });
});

describe('Get a budget using your ID', () => {
    beforeEach(() => {
        (Budget.findByPk as jest.Mock).mockImplementation((id) => {
            const budgetByID = budgets.filter(bud => bud.id === id)[0];
            return Promise.resolve(budgetByID);
        }); 
    });

    it('Should return a budget with ID 1 and 3 expenses', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets/:budgetID',
            budget: { id: 1 }
        });

        const res = createResponse();
        await BudgetController.getById(req, res);

        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data.expenses).toHaveLength(3);

        expect(Budget.findByPk).toHaveBeenCalled();
        expect(Budget.findByPk).toHaveBeenCalledTimes(1);
        expect(Budget.findByPk).toHaveBeenCalledWith(req.budget.id, { include: [Expense] });
    });

    it('Should return a budget with ID 2 and 2 expenses', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets/:id',
            budget: { id: 2 }
        });

        const res = createResponse();
        await BudgetController.getById(req, res);

        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data.expenses).toHaveLength(2);
    });

    it('Should return a budget with ID 3 and 0 expenses', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets/:id',
            budget: { id: 3 }
        });

        const res = createResponse();
        await BudgetController.getById(req, res);

        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data.expenses).toHaveLength(0);
    });
});

describe('Update budget according to ID', () => {
    it('Should update budget and return success message', async () => {
        const mockBudget = {
            update: jest.fn().mockResolvedValue(true)
        };
        
        const req = createRequest({
            method: 'PUT',
            url: '/api/budgets/:budgetID',
            budget: mockBudget,
            body: {name: 'Presupuesto actualizado', amount: 400}
        });

        const res = createResponse();
        await BudgetController.updateById(req, res);

        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data).toEqual('Budget updated correctly');

        expect(mockBudget.update).toHaveBeenCalled();
        expect(mockBudget.update).toHaveBeenCalledTimes(1);
        expect(mockBudget.update).toHaveBeenCalledWith(req.body);
    });
});

describe('Budget removal based on your ID', () => {
    it('Should delete budget and return success message', async () => {
        const mockBudget = {
            destroy: jest.fn().mockResolvedValue(true)
        };
        
        const req = createRequest({
            method: 'DELETE',
            url: '/api/budgets/:budgetID',
            budget: mockBudget,
        });

        const res = createResponse();
        await BudgetController.deleteById(req, res);

        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data).toEqual('Budget successfully removed');

        expect(mockBudget.destroy).toHaveBeenCalled();
        expect(mockBudget.destroy).toHaveBeenCalledTimes(1);
    });
});