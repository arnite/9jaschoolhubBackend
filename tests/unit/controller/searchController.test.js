import { jest } from '@jest/globals';
import AppError from '../../../utils/appError.js';
import universityModel from '../../../models/universityModel.js';

// Mock APIFeatures class
const mockFilter = jest.fn().mockReturnThis();
const mockSort = jest.fn().mockReturnThis();
const mockPaginate = jest.fn().mockReturnThis();

const mockAPIFeatures = jest.fn().mockImplementation(() => ({
  filter: mockFilter,
  sort: mockSort,
  paginate: mockPaginate,
  query: Promise.resolve([]), 
}));

// Override the actual APIFeatures import with the mock
jest.unstable_mockModule('../../../utils/apiFeatures.js', () => ({
  default: mockAPIFeatures,
}));

const { searchByProgramme } = await import('../../../controllers/searchController.js');

describe('Search by Programme Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    // Clear previous calls
    mockFilter.mockClear();
    mockSort.mockClear();
    mockPaginate.mockClear();
  });

  it('should return 400 if search query is missing', async () => {
    await searchByProgramme(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].statusCode).toBe(400);
    expect(next.mock.calls[0][0].message).toBe('search query parameter is required');
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 404 if no universities match the search', async () => {
    req.query = { search: 'Computer Science' };

    // override query for this test
    mockAPIFeatures.mockImplementation(() => ({
      filter: mockFilter,
      sort: mockSort,
      paginate: mockPaginate,
      query: Promise.resolve([]),
    }));

    await searchByProgramme(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].statusCode).toBe(404);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 200 and matching universities', async () => {
    req.query = { search: 'Computer Science' };

    const mockData = [
      { university_name: 'UNILAG', notable_programs: ['Computer Science'] },
      { university_name: 'UI', notable_programs: ['Computer Science'] },
    ];

    mockAPIFeatures.mockImplementation(() => ({
      filter: mockFilter,
      sort: mockSort,
      paginate: mockPaginate,
      query: Promise.resolve(mockData),
    }));

    await searchByProgramme(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      count: 2,
      data: mockData,
    });
    expect(next).not.toHaveBeenCalled();
  });
});


// Import the controller after mocks are defined
const { searchByUniversity } = await import('../../../controllers/searchController.js');

describe('Search by University Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    mockFilter.mockClear();
    mockSort.mockClear();
    mockPaginate.mockClear();
  });

  it('should return 400 if search query is missing', async () => {
    await searchByUniversity(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].statusCode).toBe(400);
    expect(next.mock.calls[0][0].message).toBe('search query parameter is required');
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 404 if no universities match the search', async () => {
    req.query = { search: 'NonExistentUniversity' };

    mockAPIFeatures.mockImplementation(() => ({
      filter: mockFilter,
      sort: mockSort,
      paginate: mockPaginate,
      query: Promise.resolve([]), // no results
    }));

    await searchByUniversity(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].statusCode).toBe(404);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 200 and matching universities', async () => {
    req.query = { search: 'Jos' };

    const mockData = [
      { university_name: 'University of Jos', location: 'Jos' },
      { university_name: 'UNIJOS', location: 'Jos' },
    ];

    mockAPIFeatures.mockImplementation(() => ({
      filter: mockFilter,
      sort: mockSort,
      paginate: mockPaginate,
      query: Promise.resolve(mockData),
    }));

    await searchByUniversity(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      count: 2,
      data: mockData,
    });
    expect(next).not.toHaveBeenCalled();
  });
});
