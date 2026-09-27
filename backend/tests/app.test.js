import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('Server', () => {
    it('should return a health check response', async () => {
        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Expense tracker app is running',
        });
    });
});