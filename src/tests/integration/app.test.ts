import request from 'supertest';
import server from '../../server';

describe('Authentication - Create Account', () => {
    it('Should display validation errors when form is empty', async () => {
        const response = await request(server)
                                    .post('/api/auth/create-account')
                                    .send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(4);
    });


});