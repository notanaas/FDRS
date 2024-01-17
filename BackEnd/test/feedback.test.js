const { feedback } = require('../controllers/FeedbackController'); // replace with actual path
const FeedBack = require("../models/FeedBack");

jest.mock('../models/FeedBack');

describe('Feedback Controller', () => {
    beforeEach(() => {
        // Reset mocks before each test
        FeedBack.mockReset();
    });

    test('successfully submit feedback', async () => {
        FeedBack.prototype.save = jest.fn().mockResolvedValue({});

        const req = {
            user: { _id: 'userId123' },
            body: { SearchText: 'example search' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        await feedback(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Thank you for your feedback" });
        expect(FeedBack.prototype.save).toHaveBeenCalled();
    });

    test('fail to submit feedback due to missing search term', async () => {
        const req = {
            user: { _id: 'userId123' },
            body: {}
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        await feedback(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Search term is required." });
    });

    test('handle error when saving feedback', async () => {
        FeedBack.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

        const req = {
            user: { _id: 'userId123' },
            body: { SearchText: 'example search' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        await feedback(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "An error occurred while submitting feedback." });
    });

    // More tests...
});
