import { createRequest, createResponse } from 'node-mocks-http';
import { validateBudgetExist } from '../../../middlewares/budget';
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

    
});




