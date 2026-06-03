import request from 'supertest';
import server from '../../server';
import {beforeAll, beforeEach, describe, expect, it, jest} from '@jest/globals';
import { AuthController } from '../../controllers/AuthController';
import User from '../../models/User';
import * as authUtils from '../../utils/auth';
import * as jwtUtils from '../../utils/jwt';

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
    beforeEach(() => {
        jest.clearAllMocks()
    });

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

    it('Should return 400 bad request when the email is invalid', async () => {
        const form = {
            email: 'in_valid',
            password: '123456789'
        };

        const response = await request(server)
                                    .post('/api/auth/login')
                                    .send(form);


        const login = jest.spyOn(AuthController, 'login');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');

        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors).not.toHaveLength(2);

        expect(response.body.errors[0].msg).toBe('Invalid email');
        expect(login).not.toHaveBeenCalled();
    });

    it('Should return 404 if user not found', async () => {
        const form = {
            email: 'user@test.com',
            password: '123456789'
        };

        const response = await request(server)
                                    .post('/api/auth/login')
                                    .send(form);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');

        expect(response.status).not.toBe(200);
        expect(response.body.error).toBe('User not found');
    });

    it('Should return 403 if user account is not confirmed', async () => {
        
        (jest.spyOn(User, 'findOne') as jest.Mock)
            .mockResolvedValue({
                id: 1,
                confirmed: false,
                password: 'hashedpassword',
                email: 'user_not_found@test.com'
            })

        const response = await request(server)
                                    .post('/api/auth/login')
                                    .send({
                                        "password": 'password',
                                        "email": 'user_not_found@test.com'
                                    });

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('error');

        expect(response.status).not.toBe(200);
        expect(response.status).not.toBe(404);
        expect(response.body.error).toBe('User not confirmed');
    });

    it('Should return 401 if the password is incorrect', async () => {
        
        const findOne = (jest.spyOn(User, 'findOne') as jest.Mock)
            .mockResolvedValue({
                id: 1,
                confirmed: true,
                password: 'hashedpassword'
            });

        const checkPassword = (jest.spyOn(authUtils, 'checkPassword') as jest.Mock).mockResolvedValue(false);

        const response = await request(server)
                                    .post('/api/auth/login')
                                    .send({
                                        "password": 'password',
                                        "email": 'test@test.com'
                                    });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');

        expect(response.status).not.toBe(200);
        expect(response.status).not.toBe(404);

        expect(response.status).not.toBe(403);
        expect(response.body.error).toBe('Incorrect password');

        expect(findOne).toHaveBeenCalledTimes(1);
        expect(checkPassword).toHaveBeenCalledTimes(1);
    });

    it('Should return 200 if the login is successful', async () => {
        
        const findOne = (jest.spyOn(User, 'findOne') as jest.Mock)
            .mockResolvedValue({
                id: 1,
                confirmed: true,
                password: 'hashedpassword'
            });

        const checkPassword = (jest.spyOn(authUtils, 'checkPassword') as jest.Mock).mockResolvedValue(true);
        const generateJWT = (jest.spyOn(jwtUtils, 'generateJWT') as jest.Mock).mockReturnValue('jwt_token');

        const response = await request(server)
                                    .post('/api/auth/login')
                                    .send({
                                        "password": 'password',
                                        "email": 'test@test.com'
                                    });

        expect(response.status).toBe(200);
        expect(response.body).toEqual('jwt_token');

        expect(findOne).toHaveBeenCalled();
        expect(findOne).toHaveBeenCalledTimes(1);

        expect(checkPassword).toHaveBeenCalled();
        expect(checkPassword).toHaveBeenCalledTimes(1);
        expect(checkPassword).toHaveBeenCalledWith('password', 'hashedpassword');

        expect(generateJWT).toHaveBeenCalled();
        expect(generateJWT).toHaveBeenCalledTimes(1);
        expect(generateJWT).toHaveBeenCalledWith(1);
    });
});

describe('GET /api/budgets', () => {
    let jwt: string;

    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeAll(async () => {
        const response = await request(server)
                                .post('/api/auth/login')
                                .send({
                                    "email": 'test9@correo.com',
                                    "password": 'password9'
                                });
            
        jwt = response.body;
        expect(response.status).toBe(200);
    });

    it('Should return reject unauthenticated access budget without a jwt', async () => {
        const response = await request(server)
                                .get('/api/budgets');

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Unauthorized');
    });

    it('Should return reject unauthenticated access budget without a valid jwt', async () => {
        const response = await request(server)
                                .get('/api/budgets')
                                .auth('in_valid', {type: 'bearer'});

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('There was a mistake in token');
    });

    it('Should allow authenticated access to budgets with a valid jwt', async () => {
        const response = await request(server)
                                .get('/api/budgets')
                                .auth(jwt, {type: 'bearer'});

        expect(response.status).not.toBe(401);
        expect(response.body).toHaveLength(0);
        expect(response.body.error).not.toBe('Unauthorized');
    });
});