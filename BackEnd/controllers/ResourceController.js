const Resource = require("../models/Resource")
const Faculty = require("../models/Faculty")
const Author = require("../models/Author")
const comments = require("../models/Comment")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator"); // validator and sanitizer
const multer = require("../multerconfig")
const path  = require("path")
const { upload } = require('../multerconfig');


// Get all resources
exports.resource_list = asyncHandler(async (req, res, next) => {
    // Extract the faculty name from the URL parameter
    const facultyName = req.params.FacultyName;
  
    // Find the faculty based on the name (you may need to adjust this based on your data model)
    const faculty = await Faculty.findOne({ FacultyName: facultyName});
  
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    // Use the faculty's unique ID to query resources
    const allResources = await Resource.find({ Faculty: faculty._id  , isAuthorized : true  }, "ResourceTitle ResourceAuthor Description ResourceCover")
      .sort({ title: 1 })
      .populate("Author")
      .populate("Faculty")
      .populate("User")
      .exec();
  
    res.status(200).json({ Resource_list: allResources });
  });
// Display detail page for a specific Resource.
exports.Resource_detail = asyncHandler(async (req, res, next) => {
  // Get details of books, book instances for specific Resource
  const [resource,comments] = await Promise.all([
    Resource.findById(req.params.id).populate("Author").populate("Faculty").populate("User").exec(),
    comments.find({Resource : req.params.id}).populate("User").exec()
  ])
  const numComments = await Comment.countDocuments({ Resource: req.params.id });
  if(resource == null)
  {
    // no Results
    return res.status(404).json({ error: 'Resource not found' });
  }
  res.status(200).json({Resource_details : resource , comments : comments , numcomment : numComments})
});


  
// Handle Resource create on POST.
exports.Resource_create_post = [
  // Validate and sanitize fields.
  body("title", "Title must not be empty!")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("authorFirstName", "Author firstname must not be empty!")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("authorLastName", "Author lastname must not be empty!") // Corrected error message
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty!")
    .isLength({ min: 1 })
    .escape(),
  body("related_link")
    .trim()
    .escape(),

  // Handle file uploads using multer.
  upload.fields([
    { name: 'file', maxCount: 1 }, // PDF file
    { name: 'img', maxCount: 1 },  // Image file
  ]),

  // Detect and set the resource type automatically.
  (req, res, next) => {
    if (req.files && req.files.file) {
      const pdfType = fileType(req.files.file[0].buffer);
      if (pdfType && pdfType.mime === 'application/pdf') {
        req.body.ResourceType = 'PDF';
      }
    } else if (req.files && req.files.img) {
      const imgType = fileType(req.files.img[0].buffer);
      if (imgType && ['image/jpeg', 'image/jpg', 'image/png'].includes(imgType.mime)) {
        req.body.ResourceType = 'Image';
      }
    }
    next();
  },

  // Process request after validation, sanitization, and file uploads.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Return JSON response with error messages.
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Create a new author.
      const author = new Author({
        firstName: req.body.authorFirstName,
        lastName: req.body.authorLastName,
      });

      // Save the author.
      await author.save();
      // Create a Resource object with escaped and trimmed data.
      const resource = new Resource({
        User: req.user._id, // Assuming you have a user object with _id
        Faculty: "you must give me the faculty id  which you must have ", // Change to match your request body or logic
        ResourceAuthor: author._id,
        ResourceTitle: req.body.title,
        isAuthorized: false, // Default value is set to false
        ResourceType: req.body.ResourceType, // Set this based on your logic or request
        Description: req.body.description,
        file_path: req.files.file[0].path, // Store the file path
        file_size: req.files.file[0].size, // Store the file size
        ResourceCover: req.files.img[0].path, // Store the image path as ResourceCover
        Related_link: req.body.related_link, // Change to match your request body
      });

      // Save the resource.
      await resource.save();

      // Return a JSON response with the created resource.
      res.status(201).json({ resource });
    } catch (err) {
      // Handle any errors that occur during author or resource creation.
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }),
];



exports.pdf_download = asyncHandler(async(req,res,next)=>
{
  const UPLOADS_DIR = path.join(__dirname, '../uploads');
  const ResourceId = req.params.id

    const resource  = await Resource.findById(ResourceId)
    if(!resource)
    {
      return res.status(404).json({ message: 'PDF not found.' });
    }
    const filePath = path.join(UPLOADS_DIR, path.basename(resource.file_path));
    res.download(filePath)
})
  
exports.search_resource = asyncHandler(async (req, res, next) => {
  const searchTerm = req.query.term;

  // Implement your search query based on the searchTerm
  // Search by both author's name and title using a case-insensitive text search
  const searchResults = await Resource.find({
    $or: [
      { ResourceTitle: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search for title
    ],
  }).populate({
    path: 'ResourceAuthor',
    match: {
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search for author's full name
      ],
    },
  });

  // Filter out resources with null ResourceAuthor (unpopulated authors)
  const filteredResults = searchResults.filter((resource) => resource.ResourceAuthor);

  if (filteredResults.length === 0) {
    return res.status(404).json({ message: 'No matching resources found' });
  }

  res.json(filteredResults);
});
