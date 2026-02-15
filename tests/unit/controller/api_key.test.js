import { jest } from '@jest/globals';
import httpMocks from 'node-mocks-http';
import { API_KEY } from '../../../controllers/api_keys.js';
import AppError from '../../../utils/appError.js';


let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('API_KEY Middleware', () => {
  it('should call next with AppError if API_KEY is missing', () => {
    process.env.API_KEY = 'secret-key';
    
    API_KEY(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].message).toBe('Invalid API Key');
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });

  it('should call next with AppError if API_KEY is incorrect', () => {
    req = httpMocks.createRequest({
      headers: {
        'API_KEY': 'wrong-key'
      }
    });

    process.env.API_KEY = 'correct-key';

    API_KEY(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].message).toBe('Invalid API Key');
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });

  it('should call next without error if API_KEY is correct', () => {
    req = httpMocks.createRequest({
      headers: {
        'API_KEY': 'correct-key'
      }
    });

    process.env.API_KEY = 'correct-key';

    API_KEY(req, res, next);

    expect(next).toHaveBeenCalledWith(); // No error passed to next
  });
});

