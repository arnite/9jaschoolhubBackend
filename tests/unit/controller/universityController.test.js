import universityModel from '../../../models/universityModel.js';
import AppError from '../../../utils/appError.js';
import { afterEach, beforeEach, describe, expect, jest } from '@jest/globals';
import APIFeatures from '../../../utils/apiFeatures.js';
import { createUniversity, getAllUniversities, getUniversityById, updateUniversity, deleteUniversity } from '../../../controllers/universityController.js';

jest.mock('../../../models/universityModel.js');
jest.mock('../../../utils/catchAsync.js');

describe('Create University Controller - createUniversity', () => {
    let req, res, next;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();

        universityModel.findOne = jest.fn();
        universityModel.create = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('University already exists', () => {
        beforeEach(() => {
            req = {
                body: {
                    university_name: 'Test University',
                    website: 'https://test.edu',
                },
            };
        });

        it('should return 400 if university already exists', async () => {
            const existingUniversity = {
                _id: 'existing123',
                university_name: 'Test University',
                website: 'https://test.edu',
            };

            universityModel.findOne.mockResolvedValue(existingUniversity);

            await createUniversity(req, res, next);

            expect(universityModel.findOne).toHaveBeenCalledWith({ website: 'https://test.edu' });
            expect(universityModel.create).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(expect.any(AppError));
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe('Create new University', () => {
        it('should return 201 if university is successfully created', async () => {
            const mockUniv = {
                _id: 'someId',
                university_name: 'University of Jos',
                website: 'https://unijos.edu'
            };

            const req = {
                body: { ...mockUniv }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const next = jest.fn();

            universityModel.findOne = jest.fn().mockResolvedValue(null);
            universityModel.create = jest.fn().mockResolvedValue(mockUniv);

            await createUniversity(req, res, next);

            expect(universityModel.findOne).toHaveBeenCalledWith({ website: mockUniv.website });
            expect(universityModel.create).toHaveBeenCalledWith(mockUniv);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: { newUniversity: mockUniv }
            });
        });
    });

});

// Get All University Route Handler Unit Test
describe('Get all university - getAllUniversities', () => {

    let req, res, next;

    beforeEach(() => {
        req = {
            query: {}
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        next = jest.fn()
    });

    it('should return 200 and universities when found', async () => {

        // Mock data
        const mockUniversities = [
            {name: 'University of Jos'},
            {name: 'University of Ibadan'}
        ]

        const mockQuery = {
            find: jest.fn().mockResolvedValue(mockUniversities),
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis()
        };

        jest.spyOn(APIFeatures.prototype, 'filter').mockImplementation(function () {
        this.query = Promise.resolve(mockUniversities);
        return this;
        });

        jest.spyOn(APIFeatures.prototype, 'sort').mockImplementation(function () {
        return this;
        });

        jest.spyOn(APIFeatures.prototype, 'paginate').mockImplementation(function () {
        return this;
        });


        await getAllUniversities(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            count: 2,
            data: { doc: mockUniversities }
        });
    });

})

// Get University ID 
describe('Get University ID - getUniversityById', () => {

    let req, res, next;

    beforeEach (() => {
        req = {
            params: {
                id: 'test123'
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        next = jest.fn()

        universityModel.findById = jest.fn();
    })

    it('Return 404 if university does not exist', async () => {

        universityModel.findById.mockResolvedValue(null)

        await getUniversityById(req, res, next);

        expect(next).toHaveBeenCalled();

        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(AppError)
        expect(err.statusCode).toBe(404)
        expect(err.message).toMatch('University does not exist')
    });

    it( 'should return univerity with corresponding ID', async () => {

        const mockUni = {
            id: 'test123',
            university_name: 'Univerity of Jos'
        }

        universityModel.findById.mockResolvedValue(mockUni)

        await getUniversityById(req, res, next)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: { university: mockUni}
        })
    })
})

// Update Univerity by ID
describe('Update Univerity by ID - updatedUniversity', () => {
    let req, res, next;

    beforeEach (() => {
        req = {
            params: {
                id: 'test123'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        next = jest.fn();

        universityModel.findOneAndUpdate = jest.fn();
    })

    it('should return 404 if univerity does not exist', async () => {

        universityModel.findOneAndUpdate.mockResolvedValue(null)

        await updateUniversity(req, res, next);

        expect(next).toHaveBeenCalled()

        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(AppError)
        expect(err.statusCode).toBe(404)
        expect(err.message).toMatch('University do not exist...')
    });

    it('should update university by id', async () => {

        const mockUpdateUni = {
            id: 'test123',
            university_name: 'University of Jos, Nigeria'
        }

        universityModel.findOneAndUpdate.mockResolvedValue(mockUpdateUni);

        await updateUniversity(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: { updatedUniversity: mockUpdateUni}
        })
    })
})


// Delete University with ID

describe('Delete University By ID', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: {
                id: 'test123'
            }
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        next = jest.fn()

        universityModel.findOneAndDelete = jest.fn()
    })

    it('should return 404 if university do not exist', async () => {

        universityModel.findOneAndDelete.mockResolvedValue(null);

        await deleteUniversity(req, res, next)

        expect(next).toHaveBeenCalled()

        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(AppError)
        expect(err.statusCode).toBe(404)
        expect(err.message).toMatch('University do not exist....')
    });

    it('should return 201 if a university is successfully deleted', async () => {

        const mockUniversity = {
            id: 'test123',
            university_name: 'University of Ibadan'
        }

        universityModel.findOneAndDelete.mockResolvedValue(mockUniversity);

        await deleteUniversity(req, res, next);

        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: null
        })
    })
})
