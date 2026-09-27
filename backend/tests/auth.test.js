import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('Authentication API', () => {

    describe('POST /api/auth/register', () => {

        it('should reject registration when required fields are missing', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                });

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                message: 'Name, email and password are required!',
            });
        });


        it('should reject a password shorter than 6 characters', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: '123',
                });

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                message: 'Password must be atleast 6 character long!',
            });
        });

    });


    describe('POST /api/auth/login', () => {

        it('should reject login when email or password is missing', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                });

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                message: 'Email and password are required!',
            });
        });

    });


    describe('GET /api/auth/me', () => {

        it('should reject a request without an authorization token', async () => {
            const response = await request(app)
                .get('/api/auth/me');

            expect(response.status).toBe(401);

            expect(response.body).toEqual({
                message: 'Not authorized, no token',
            });
        });


        it('should reject an invalid JWT token', async () => {
            const response = await request(app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer invalid-token');

            expect(response.status).toBe(401);

            expect(response.body).toEqual({
                message: 'Not authorized, token failed',
            });
        });

    });


    describe('PUT /api/auth/profile', () => {

        it('should reject profile update without authentication', async () => {
            const response = await request(app)
                .put('/api/auth/profile')
                .send({
                    name: 'Updated User',
                    email: 'updated@example.com',
                });

            expect(response.status).toBe(401);

            expect(response.body).toEqual({
                message: 'Not authorized, no token',
            });
        });

    });


    describe('PUT /api/auth/change-password', () => {

        it('should reject password change without authentication', async () => {
            const response = await request(app)
                .put('/api/auth/change-password')
                .send({
                    currentPassword: 'oldpassword',
                    newPassword: 'newpassword',
                });

            expect(response.status).toBe(401);

            expect(response.body).toEqual({
                message: 'Not authorized, no token',
            });
        });

    });

});