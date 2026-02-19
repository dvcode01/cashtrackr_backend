import { createRequest, createResponse } from 'node-mocks-http';
import Expense from '../../../models/Expense';
import { validateExpenseExist } from '../../../middlewares/Expense';
import { expenses } from '../../mocks/expense';

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
});