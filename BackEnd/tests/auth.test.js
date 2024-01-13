const { register } = require( '../controllers/AuthController'); // Import the register function
const Users = require('../models/Users');
const bcrypt = require('bcryptjs');

jest.mock('../models/Users');
jest.mock('bcryptjs');

describe('Register Controller', () => {
    beforeEach(() => {
        // Reset mocks before each test
        Users.findOne.mockReset();
        bcrypt.hash.mockReset();
    });

    test('should create a user successfully for valid data', async () => {
        // Mock Users.findOne to simulate no existing user
        Users.findOne.mockResolvedValue(null);

        // Mock bcrypt.hash
        bcrypt.hash.mockResolvedValue('hashedPassword');

        // Simulate req and res objects
        const req = {
            body: {
                username: 'newuser',
                email: 'newuser@example.com',
                password: 'password123'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Call the register function
        await register[register.length - 1](req, res);

        // Asserts...
    });

    // More tests...
});
