const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

const resourceSchema = new Schema({
  User: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  Faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true },
  ResourceAuthor: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
  ResourceTitle: { type: String, required: true },
  isAuthorized: { type: Boolean, default: false },
  Description: { type: String, minLength: 100, maxLength: 500, required: true },
  file_path: { type: String, required: true },
  file_size: { type: Number, required: true},
  ResourceCover: { type: String },
  Related_link: { type: String },
  created_at: { type: Date, default: Date.now }
});

// Add indexes for efficient searching
resourceSchema.index({ ResourceAuthor: 1 });
resourceSchema.index({ ResourceTitle: 'text' }); // Text index for searching titles

resourceSchema.virtual("Date_formatted").get(function () {
  const date = DateTime.fromJSDate(this.created_at);

  // Get the day, month, and year components
  const day = date.day;
  const month = date.toFormat('LLL'); // Format the month as a short name, e.g., "Oct"
  const year = date.year;

  let daySuffix = '';
  if (day === 1 || day === 21 || day === 31) {
    daySuffix = 'st';
  } else if (day === 2 || day === 22) {
    daySuffix = 'nd';
  } else if (day === 3 || day === 23) {
    daySuffix = 'rd';
  } else {
    daySuffix = 'th';
  }

  return `${month} ${day}${daySuffix}, ${year}`;
});

module.exports = mongoose.model("Resource", resourceSchema);