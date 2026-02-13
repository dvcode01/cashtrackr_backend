import { budgets } from "../mocks/budget";

describe('Get all budgets', () => {
    it('Should retrieve 3 budgets', () => { 
        expect(budgets).toHaveLength(3);
    })
});