const { add_favorite , remove_favorite } = require('../controllers/FavoriteController'); // replace with actual path
const UserFavRes = require("../models/UserFavRes");

jest.mock('../models/UserFavRes');

describe('Add Favorite Controller and remove', () => {
    beforeEach(() => {
        // Reset mocks before each test
        UserFavRes.mockReset();
    });

    test('successfully add a resource to favorites', async () => {
        // Mock UserFavRes.save
        UserFavRes.prototype.save = jest.fn().mockResolvedValue({});

        const req = {
            user: { _id: 'userId123' },
            params: { id: 'resourceId123' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        await add_favorite(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Resource marked as a favorite' });
        expect(UserFavRes.prototype.save).toHaveBeenCalled();
    });
    test('successfully remove a resource from favorites', async () => {
        // Mock UserFavRes.findOneAndDelete
        UserFavRes.findOneAndDelete = jest.fn().mockResolvedValue({});

        const req = {
            user: { _id: 'userId123' },
            params: { id: 'resourceId123' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        await remove_favorite(req, res, next);

        expect(UserFavRes.findOneAndDelete).toHaveBeenCalledWith({ 
            User: 'userId123', 
            Resource: 'resourceId123' 
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Resource removed from favorites' });
    });

});
