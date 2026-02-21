import { createRequest, createResponse } from 'node-mocks-http';
import User from '../../../models/User';
import { AuthController } from '../../../controllers/AuthController';
import { hashPassword } from '../../../utils/auth';
import { generateToken } from '../../../utils/token';
import { AuthEmail } from '../../../emails/AuthEmail';

jest.mock('../../../models/User');
jest.mock('../../../utils/auth');
jest.mock('../../../utils/token');

describe('User registration', () => {
    beforeEach(() => jest.resetAllMocks());

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

    it('Should register a new user and return success', async () => {
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/create-account',
            body: {email: 'test@test.com', password: '3421568970', name: 'Testing'}
        });

        const res = createResponse();
        const mockUser = { ...req.body, save: jest.fn()};

        (User.create as jest.Mock).mockResolvedValue(mockUser);
        (hashPassword as jest.Mock).mockReturnValue('hashedpassword');
        (generateToken as jest.Mock).mockReturnValue('456472');
        jest.spyOn(AuthEmail, 'sendConfirmationEmail').mockImplementation(() => Promise.resolve());

        await AuthController.createAccount(req, res);
        const data = res._getJSONData();
        
        expect(User.create).toHaveBeenCalled(); 
        expect(User.create).toHaveBeenCalledWith(req.body);
        expect(User.create).toHaveBeenCalledTimes(1); 

        expect(mockUser.save).toHaveBeenCalled();
        expect(mockUser.password).toBe('hashedpassword');
        expect(mockUser.token).toBe('456472');

        expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledWith({
            name: req.body.name, 
            email: req.body.email, 
            token: '456472'
        });
        expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledTimes(1);
        
        expect(res.statusCode).toBe(201);
        expect(data).toEqual('User created successfully');
    });

});