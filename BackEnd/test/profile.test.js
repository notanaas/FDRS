const { updateProfile } = require('../controllers/UserProfileController'); // replace with actual path
const Users = require("../models/Users");
const { validationResult } = require("express-validator");

jest.mock('../models/Users');
jest.mock('express-validator', () => ({
  ...jest.requireActual('express-validator'),
  validationResult: jest.fn(),
}));

describe('Update Profile Controller', () => {
    beforeEach(() => {
        Users.findById.mockReset();
        Users.findOne.mockReset();
        validationResult.mockReset();

        validationResult.mockImplementation(() => ({
            isEmpty: () => true,
            array: () => []
        }));
    });

    test('successfully update the user profile', async () => {
        Users.findById.mockResolvedValue({ _id: 'userId123', Username: 'oldUsername', Email: 'oldEmail@example.com', save: jest.fn() });
        Users.findOne.mockResolvedValue(null);

        const req = {
            user: { _id: 'userId123' },
            body: { newUsername: 'newUsername', newEmail: 'newEmail@example.com' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        try {
            await updateProfile[updateProfile.length - 1](req, res, next);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'User profile updated successfully.' });
            expect(Users.findById().save).toHaveBeenCalled();
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    });

    // Additional test cases...
});
