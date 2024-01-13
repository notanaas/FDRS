const { comment } = require('../controllers/CommentController'); // replace with actual path
const Comment = require('../models/Comment');
const Resource = require("../models/Resources");
const { validationResult } = require("express-validator");

jest.mock('../models/Comment');
jest.mock('../models/Resources');
jest.mock('express-validator', () => ({
  ...jest.requireActual('express-validator'),
  validationResult: jest.fn(),
}));

describe('Comment Controller', () => {
    beforeEach(() => {
        // Reset mocks
        validationResult.mockReset();
        Comment.mockReset();
        Resource.mockReset();

        // Default mock for validationResult (no errors)
        validationResult.mockImplementation(() => ({
            isEmpty: () => true,
            array: () => []
        }));
    });

    test('successfully create a comment', async () => {
        const req = {
            body: { text: 'Valid comment text' },
            params: { id: 'resourceId123' },
            user: { _id: 'userId123' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        await comment[1](req, res, next); // Assuming the second function in the array is the async handler

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Comment created successfully' });
    });

    test('fail to create a comment with invalid input', async () => {
        validationResult.mockImplementation(() => ({
            isEmpty: () => false,
            array: () => [{ msg: 'Required text to post' }]
        }));

        const req = {
            body: { text: '' },
            params: { id: 'resourceId123' },
            user: { _id: 'userId123' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        await comment[1](req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            errors: expect.arrayContaining([expect.objectContaining({
                msg: 'Required text to post'
            })])
        }));
    });

    // More tests...
});
