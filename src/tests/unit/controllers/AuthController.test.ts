import { createRequest, createResponse } from 'node-mocks-http';
import User from '../../../models/User';
import { AuthController } from '../../../controllers/AuthController';

jest.mock('../../../models/User');

describe('User registration', () => {
    it('Should return 409 status and an error message', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(true);
        
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/create-account',
            body: {email: 'test@test.com', password: '3421568970'}
        });

        const res = createResponse();
        await AuthController.createAccount(req, res);

        const data = res._getJSONData();

        expect(res.statusCode).toBe(409);
        expect(data).toHaveProperty('error', 'There is already a user associated with that email address');

        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledTimes(1);
    });

});