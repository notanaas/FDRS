const { Resource_create_post } = require('../controllers/ResourcesController'); // replace with actual path
const Resource = require("../models/Resources")
const { validationResult } = require("express-validator");

jest.mock('../models/Resources');
jest.mock('express-validator', () => ({
  ...jest.requireActual('express-validator'),
  validationResult: jest.fn(),
}));

describe('Resource Create Post Controller', () => {
    beforeEach(() => {
        // Reset mocks before each test
        Resource.mockReset();
        validationResult.mockReset();

        // Default mock for validationResult (no errors)
        validationResult.mockImplementation(() => ({
            isEmpty: () => true,
            array: () => []
        }));
    });

    test('successfully create a resource', async () => {
        Resource.prototype.save = jest.fn().mockResolvedValue({});

        const req = {
            user: { _id: 'userId123', isAdmin: true },
            params: { id: 'facultyId123' },
            body: {
                firstname: 'Author',
                lastname: 'Example',
                title: 'Unique Title',
                description: 'Description here',
                related_link: 'http://example.com'
            },
            files: {
                file: [{ path: 'path/to/file.pdf', size: 12345 }],
                img: [{ path: 'path/to/image.jpg' }]
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        await Resource_create_post[Resource_create_post.length - 1](req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Resource created successfuly" }); 
        expect(Resource.prototype.save).toHaveBeenCalled();
    });

    // Additional test cases...
});
