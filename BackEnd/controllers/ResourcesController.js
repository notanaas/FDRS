const Resource = require("../models/Resources")
const Faculty = require("../models/Faculty")
const comments = require("../models/Comment")
const asyncHandler = require("express-async-handler")
const {body,validationResult} = require("express-validator")
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
      .populate("Faculty")
      .populate("User")
      .exec();
  
    res.status(200).json({ Resource_list: allResources });
  });
// Display detail page for a specific Resource.
exports.Resource_detail = asyncHandler(async (req, res, next) => {
  // Get details of books, book instances for specific Resource
  const [resource,comments] = await Promise.all([
    Resource.findById(req.params.id).populate("Faculty").populate("User").exec(),
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
  upload.fields([
    { name: 'file', maxCount: 1 }, // PDF file
    { name: 'img', maxCount: 1 },  // Image file
    ]),
  // Validate and sanitize fields.
  body("title", "Title must not be empty!")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("firstname", "Author firstname must not be empty!")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("lastname", "Author lastname must not be empty") // Corrected error message
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty")
    .isLength({ min: 1 })
    .escape(),
  body("related_link")
    .trim()
    .escape(),

  // Process request after validation, sanitization, and file uploads.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors. Return JSON response with error messages.
      console.log({error : req.body})
      return res.status(400).json({ errors: errors.array()});
    }
    try {
      const flag = false
      if(user.isAdmin)
      {
        flag = true
      }
      // Create a Resource object with escaped and trimmed data.
      const resource = new Resource({
        User: req.user._id, // Assuming you have a user object with _id
        Faculty: req.params.id,
        Author_first_name:req.body.firstname,
        Author_last_name : req.body.lastname,
        Title: req.body.title,
        isAuthorized: flag, // Default value is set to false
        Description: req.body.description,
        file_path: req.files.file[0].path, // Store the file path
        file_size: req.files.file[0].size, // Store the file size
        Cover: req.files.img[0].path, // Store the image path as ResourceCover
        Related_link: req.body.related_link, // Change to match your request body
      });
      // Save the resource.
      await resource.save();

      // Return a JSON response with the created resource.
      return res.status(201).json({ message : "Resource created successfuly" });

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
        { Title: { $regex: searchTerm, $options: 'i' }},  // Case-insensitive search for title
        { Author_first_name: { $regex: searchTerm, $options: 'i' }},  // Case-insensitive search for author's first name
        { Author_last_name: { $regex: searchTerm, $options: 'i' }}  // Case-insensitive search for author's last name
    ],
});


  // Filter out resources with null ResourceAuthor (unpopulated authors)
  const filteredResults = searchResults.filter((resource) => resource.ResourceAuthor);

  if (filteredResults.length === 0) {
    return res.status(404).json({ message: 'No matching resources found' });
  }

  res.json(filteredResults);
});