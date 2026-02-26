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
        expect(response.body.errors[0].msg).toBe('Invalid email');
    });

    it('Should return 400 status when password is less than 8 characters', async () => {
        const user = {
            email: 'correo@correo.com',
            name: 'Alex',
            password: '1234'
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
        expect(response.body.errors[0].msg).toBe('The password is very short, it must have minimum of 8 characters');
    });

    it('Should return 201', async () => {
        const user = {
            email: 'alex@correo.com',
            name: 'Alex',
            password: '234567890'
        };
        
        const response = await request(server)
                                    .post('/api/auth/create-account')
                                    .send(user);

        expect(response.status).toBe(201);
        expect(response.status).not.toBe(400);
        expect(response.body).not.toHaveProperty('errors');
    });
});