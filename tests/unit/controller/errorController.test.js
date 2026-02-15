import { jest } from '@jest/globals';
import httpMocks from 'node-mocks-http';
import errorController from '../../../controllers/errorController.js'


let req, res, next;

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe('Error Controller', () => {

    describe('Development Environment', () => {
        beforeEach(() => {
            process.env.NODE_ENV = 'development';
        });

        it('should send a detailed error in development', () => {
            const error = {
                statusCode: 404,
                status: 'fail',
                message: 'Not found',
                stack: 'stack trace'
            };

            errorController(error, req, res, next);

            expect(res.statusCode).toBe(404);
            expect(res._getJSONData()).toEqual({
                status: 'fail',
                error,
                message: 'Not found',
                stack: 'stack trace',
            });
        });

        it('should set default statusCode and status if not provided', () => {
            const error = new Error('Test error');

            errorController(error, req, res, next);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData()).toEqual({
                status: 'error',
                error: {
                    status: 'error',
                    statusCode: 500
                },
                message: 'Test error',
                stack: error.stack,
            });
        });
    });

    describe('Production Environment', () => {
        beforeEach(() => {
            process.env.NODE_ENV = 'production';
        });

        it('should send specific operational errors', () => {
            const error = {
                statusCode: 400,
                status: 'fail',
                message: 'Invalid input',
                isOperational: true,
            };

            errorController(error, req, res, next);

            expect(res.statusCode).toBe(400);
            expect(res._getJSONData()).toEqual({
                status: 'fail',
                message: 'Invalid input',
            });
        });

        it('should send a generic message for non-operational errors', () => {
            const error = new Error('Unexpected error');

            errorController(error, req, res, next);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData()).toEqual({
                status: 'error',
                message: 'Something went very wrong',
            });
        });
    });
});
