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
                    email: 'test@university.edu'
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

            // Fixed: Check for correct $or query structure
            expect(universityModel.findOne).toHaveBeenCalledWith({
                $or: [
                    { university_name: 'Test University' },
                    { email: 'test@university.edu' },
                    { website: 'https://test.edu' }
                ]
            });
            expect(universityModel.create).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                message: 'University already exists',
                statusCode: 400
            }));
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe('Create new University', () => {
        it('should return 201 if university is successfully created', async () => {
            const mockUniv = {
                _id: 'someId',
                university_name: 'University of Jos',
                website: 'https://unijos.edu',
                email: 'info@unijos.edu'
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

            expect(universityModel.findOne).toHaveBeenCalledWith({
                $or: [
                    { university_name: mockUniv.university_name },
                    { email: mockUniv.email },
                    { website: mockUniv.website }
                ]
            });
            expect(universityModel.create).toHaveBeenCalledWith(mockUniv);
            expect(res.status).toHaveBeenCalledWith(201);
            // Fixed: Match controller response structure
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: { university: mockUniv }
            });
        });
    });

    describe('Validation tests', () => {
        it('should handle partial data correctly', async () => {
            const req = {
                body: {
                    university_name: 'Test University'
                    // No email or website
                }
            };

            universityModel.findOne.mockResolvedValue(null);
            universityModel.create.mockResolvedValue(req.body);

            await createUniversity(req, res, next);

            expect(universityModel.findOne).toHaveBeenCalledWith({
                $or: [
                    { university_name: 'Test University' },
                    { email: undefined },
                    { website: undefined }
                ]
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

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should return 200 and universities when found', async () => {
        const mockUniversities = [
            {name: 'University of Jos'},
            {name: 'University of Ibadan'}
        ]

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

    it('should return 404 if no university is found', async () => {
        const mockUniversities = []

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

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'No university found',
                statusCode: 404,
                status: 'fail'
            })
        );

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});

// Get University ID 
describe('Get University ID - getUniversityById', () => {

    let req, res, next;

    beforeEach (() => {
        req = {
            params: {
                id: '507f1f77bcf86cd799439011' // Valid ObjectId format
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        next = jest.fn()

        universityModel.findById = jest.fn();
    })

    // Added: Test for invalid ID format
    it('should return 400 for invalid ID format', async () => {
        req.params.id = 'invalid-id';

        await getUniversityById(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Invalid university ID format',
            statusCode: 400
        }));
        expect(universityModel.findById).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 404 if university does not exist', async () => {

        universityModel.findById.mockResolvedValue(null)

        await getUniversityById(req, res, next);

        expect(universityModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'University not found', // Updated to match controller
            statusCode: 404
        }));
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('should return university with corresponding ID', async () => {

        const mockUni = {
            _id: '507f1f77bcf86cd799439011',
            university_name: 'University of Jos'
        }

        universityModel.findById.mockResolvedValue(mockUni)

        await getUniversityById(req, res, next)

        expect(universityModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: { university: mockUni}
        })
        expect(next).not.toHaveBeenCalled();
    })
})

// Update University by ID
describe('Update University by ID - updateUniversity', () => {
    let req, res, next;

    beforeEach (() => {
        req = {
            params: {
                id: '507f1f77bcf86cd799439011' // Valid ObjectId
            },
            body: {
                university_name: 'Updated University Name'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        next = jest.fn();

        // Fixed: Use correct method name
        universityModel.findByIdAndUpdate = jest.fn();
        universityModel.findOne = jest.fn();
    })

    // Added: Test for invalid ID format
    it('should return 400 for invalid ID format', async () => {
        req.params.id = 'invalid-id';

        await updateUniversity(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Invalid university id',
            statusCode: 400
        }));
        expect(universityModel.findOne).not.toHaveBeenCalled();
        expect(universityModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    // Added: Test for duplicate check
    it('should return 400 if university with same details already exists', async () => {
        const existingUniversity = {
            _id: 'different-id',
            university_name: 'Updated University Name'
        };

        universityModel.findOne.mockResolvedValue(existingUniversity);

        await updateUniversity(req, res, next);

        expect(universityModel.findOne).toHaveBeenCalledWith({
            _id: { $ne: '507f1f77bcf86cd799439011' },
            $or: [
                { university_name: 'Updated University Name' },
                { email: undefined },
                { website: undefined }
            ]
        });
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'University with these details exists',
            statusCode: 400
        }));
        expect(universityModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should return 404 if university does not exist', async () => {

        universityModel.findOne.mockResolvedValue(null); // No duplicate
        universityModel.findByIdAndUpdate.mockResolvedValue(null) // University not found

        await updateUniversity(req, res, next);

        expect(universityModel.findByIdAndUpdate).toHaveBeenCalledWith(
            '507f1f77bcf86cd799439011',
            req.body,
            { new: true, runValidators: true }
        );
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'University not found', // Updated to match controller
            statusCode: 404
        }));
    });

    it('should update university by id', async () => {

        const mockUpdateUni = {
            _id: '507f1f77bcf86cd799439011',
            university_name: 'University of Jos, Nigeria'
        }

        universityModel.findOne.mockResolvedValue(null); // No duplicate
        universityModel.findByIdAndUpdate.mockResolvedValue(mockUpdateUni);

        await updateUniversity(req, res, next);

        expect(universityModel.findByIdAndUpdate).toHaveBeenCalledWith(
            '507f1f77bcf86cd799439011',
            req.body,
            { new: true, runValidators: true }
        );
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: { updatedUniversity: mockUpdateUni}
        })
        expect(next).not.toHaveBeenCalled();
    })
})


// Delete University with ID
describe('Delete University By ID - deleteUniversity', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: {
                id: '507f1f77bcf86cd799439011' // Valid ObjectId
            }
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        next = jest.fn()

        // Fixed: Use correct method name
        universityModel.findByIdAndDelete = jest.fn()
    })

    // Added: Test for invalid ID format
    it('should return 400 for invalid ID format', async () => {
        req.params.id = 'invalid-id';

        await deleteUniversity(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Invalid university ID',
            statusCode: 400
        }));
        expect(universityModel.findByIdAndDelete).not.toHaveBeenCalled();
    });

    it('should return 404 if university does not exist', async () => {

        universityModel.findByIdAndDelete.mockResolvedValue(null);

        await deleteUniversity(req, res, next)

        expect(universityModel.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'University not found', // Updated to match controller
            statusCode: 404
        }));
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 204 if a university is successfully deleted', async () => {

        const mockUniversity = {
            _id: '507f1f77bcf86cd799439011',
            university_name: 'University of Ibadan'
        }

        universityModel.findByIdAndDelete.mockResolvedValue(mockUniversity);

        await deleteUniversity(req, res, next);

        expect(universityModel.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: null
        })
        expect(next).not.toHaveBeenCalled();
    })
})

