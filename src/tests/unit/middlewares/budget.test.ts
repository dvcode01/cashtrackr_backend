import { createRequest, createResponse } from 'node-mocks-http';
import { hasAccess, validateBudgetExist } from '../../../middlewares/budget';
import Budget from '../../../models/Budget';
import { budgets } from '../../mocks/budget';

jest.mock('../../../models/Budget', () => ({
    findByPk: jest.fn(),
}));

describe('Validation of budget existence', () => {
    it('Should handle non-existent budget', async () => {
        (Budget.findByPk as jest.Mock).mockResolvedValue(null);
        
        const req = createRequest({
            params: {
                budgetID: '1'
            }
        });

        const res = createResponse();
        const next = jest.fn();

        await validateBudgetExist(req, res, next);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(404);
        expect(data).toEqual({error: 'Budget not found'});
        
        expect(next).not.toHaveBeenCalled();
    });

    it('Should handle errors budget', async () => {
        (Budget.findByPk as jest.Mock).mockRejectedValue(new Error);
        
        const req = createRequest({
            params: {
                budgetID: '1'
            }
        });

        const res = createResponse();
        const next = jest.fn();

        await validateBudgetExist(req, res, next);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(500);
        expect(data).toEqual({error: 'There was a mistake'});
        
        expect(next).not.toHaveBeenCalled();
    });

    it('Should procedd to next middleware if budget exists', async () => {
        (Budget.findByPk as jest.Mock).mockResolvedValue(budgets[0]);
        
        const req = createRequest({
            params: {
                budgetID: '1'
            }
        });

        const res = createResponse();
        const next = jest.fn();

        await validateBudgetExist(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.budget).toEqual(budgets[0]);
    });
});

describe('Verify access to budget', () => {
    it('Should call next function if user has access', async() => {
        const req = createRequest({
            budget: budgets[0],
            user: {id: 1}
        });

        const res = createResponse();
        const next = jest.fn();

        await hasAccess(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });
});



