import request from 'supertest';
import server from '../../server';
import { AuthController } from '../../controllers/AuthController';

describe('Authentication - Create Account', () => {
    it('Should display validation errors when form is empty', async () => {
        const response = await request(server)
                                    .post('/api/auth/create-account')
                                    .send({});

        const createAccountMock = jest.spyOn(AuthController, 'createAccount');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(4);

        expect(response.status).not.toBe(201);
        expect(response.body.errors).not.toHaveLength(2);

        expect(createAccountMock).not.toHaveBeenCalled();
    });

    it('Should return 400 status when email is invalid', async () => {
        const user = {
            email: 'correo',
            name: 'Alex',
            password: '123456789'
        };
        
        const response = await request(server)
                                    .post('/api/auth/create-account')
                                    .send(user);

        const createAccountMock = jest.spyOn(AuthController, 'createAccount');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);

        expect(response.status).not.toBe(201);
        expect(response.body.errors).not.toHaveLength(2);

        expect(createAccountMock).not.toHaveBeenCalled();
    });

});