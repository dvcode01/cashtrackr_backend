import request from 'supertest';
import server from '../../server';
import {describe, expect, it, jest} from '@jest/globals';
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

    it('Should return 201 status when user is created', async () => {
        const user = {
            name: 'test9',
            email: 'test9@correo.com',
            password: 'password9'
        };
        
        const response = await request(server)
                                    .post('/api/auth/create-account')
                                    .send(user);

        expect(response.status).toBe(201);
        expect(response.status).not.toBe(400);

        expect(response.body).not.toHaveProperty('errors');
    }, 10000);

    it('Should return 409 conflict when user is already registered', async () => {
        const user = {
            name: 'test9',
            email: 'test9@correo.com',
            password: 'password9'
        };
        
        const response = await request(server)
                                    .post('/api/auth/create-account')
                                    .send(user);

        expect(response.status).toBe(409);
        expect(response.status).not.toBe(201);
        expect(response.status).not.toBe(400);

        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('There is already a user associated with that email address');

        expect(response.body).not.toHaveProperty('errors');
    });
});

describe('Authentication -  Account confirmation with token', () => {
    it('Should display error if token is empty or is not valid', async() => {
        const token = { token: 'not_valid' };

        const response = await request(server)
                            .post('/api/auth/confirm-account')
                            .send(token)

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');

        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe('Invalid token');
    });

    it('Should display error if token is invalid', async() => {
        const token = { token: '123456' };

        const response = await request(server)
                            .post('/api/auth/confirm-account')
                            .send(token)

        expect(response.status).toBe(409);
        expect(response.body).toHaveProperty('error');

        expect(response.body.error).toBe('Invalid token');
    });

    it('Should confirm account with a valid token', async() => {
        const token = globalThis.cashtrackrConfirmationAccount;

        const response = await request(server)
                            .post('/api/auth/confirm-account')
                            .send({token})

        expect(response.status).toBe(200);
        expect(response.body).toEqual('Account successfully confirmed');

        expect(response.status).not.toBe(401);
    });
})

describe('Authentication - Login', () => {
    it('Should display validation errors when the form is empty', async () => {
        const response = await request(server)
                                    .post('/api/auth/login')
                                    .send({});


        const login = jest.spyOn(AuthController, 'login');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');

        expect(response.body.errors).toHaveLength(2);
        expect(response.body.errors).not.toHaveLength(1);
        expect(login).not.toHaveBeenCalled();
    });
});