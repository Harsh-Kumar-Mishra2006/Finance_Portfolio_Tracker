// tests/auth.test.js
const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../config/database');
const { User } = require('../models');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Auth Endpoints', () => {
    test('POST /api/auth/register - should register new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Harsh Kumar',
                email: 'harsh@example.com',
                password: 'password123'
            });
        
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.user).toHaveProperty('id');
        expect(response.body.data.user.email).toBe('harsh@example.com');
        expect(response.body.data).toHaveProperty('token');
    });
    
    test('POST /api/auth/register - should not register duplicate email', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Harsh',
                email: 'harshduplicate@example.com',
                password: 'password123'
            });
        
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Harsh',
                email: 'harshduplicate@example.com',
                password: 'password123'
            });
        
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });
    
    test('POST /api/auth/login - should login user', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Login Test',
                email: 'login@example.com',
                password: 'password123'
            });
        
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'login@example.com',
                password: 'password123'
            });
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('token');
    });
    
    test('POST /api/auth/login - should reject invalid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'wrong@example.com',
                password: 'wrongpassword'
            });
        
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });
});