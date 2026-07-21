// tests/investment.test.js
const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../config/database');
const { User } = require('../models');

let token;
let userId;

beforeAll(async () => {
    await sequelize.sync({ force: true });
    
    await request(app)
        .post('/api/auth/register')
        .send({
            name: 'Investment Test',
            email: 'invest@example.com',
            password: 'password123'
        });
    
    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'invest@example.com',
            password: 'password123'
        });
    
    token = loginRes.body.data.token;
    userId = loginRes.body.data.user.id;
});

afterAll(async () => {
    await sequelize.close();
});

describe('Investment Endpoints', () => {
    let investmentId;
    
    test('POST /api/investments - should create investment', async () => {
        const response = await request(app)
            .post('/api/investments')
            .set('Authorization', `Bearer ${token}`)
            .send({
                investment_name: 'Test Fund',
                investment_type: 'Mutual Fund',
                invested_amount: 10000,
                current_value: 12000,
                purchase_date: '2026-07-01'
            });
        
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.investmentName).toBe('Test Fund');
        
        investmentId = response.body.data.id;
    });
    
    test('GET /api/investments - should get all investments', async () => {
        const response = await request(app)
            .get('/api/investments')
            .set('Authorization', `Bearer ${token}`);
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
    });
    
    test('GET /api/investments/:id - should get investment by id', async () => {
        const response = await request(app)
            .get(`/api/investments/${investmentId}`)
            .set('Authorization', `Bearer ${token}`);
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(investmentId);
    });
    
    test('PUT /api/investments/:id - should update investment', async () => {
        const response = await request(app)
            .put(`/api/investments/${investmentId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                current_value: 15000
            });
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.currentValue).toBe(15000);
    });
    
    test('DELETE /api/investments/:id - should delete investment', async () => {
        const response = await request(app)
            .delete(`/api/investments/${investmentId}`)
            .set('Authorization', `Bearer ${token}`);
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Investment deleted successfully');
    });
});