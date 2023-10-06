const mongoose = require("mongoose");

const Schema = mongoose.Schema; // Use mongoose.Schema with a capital 'S'

const resourceSchema = new Schema({
    User: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    Faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true },
    ResourceAuthor: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
    ResourceTitle: { type: String, required: true },
    isAuthorized: { type: Boolean, default: false },
    ResourceType: { type: String },
    Description: { type: String, minLength: 100, maxLength: 500, required: true },
    file_path: { type: String, required: true },
    file_size: { type: Number, required: true, max: 30 },
    ResourceCover: { type: String },
    Related_link: { type: String },
    created_at: { type: Date, default: Date.now }
});

// Add indexes for efficient searching
resourceSchema.index({ ResourceAuthor: 1 });
resourceSchema.index({ ResourceTitle: 'text' }); // Text index for searching titles

module.exports = mongoose.model("Resource", resourceSchema);
