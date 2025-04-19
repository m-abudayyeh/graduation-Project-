const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine upload path based on file type
    let uploadPath = 'uploads/';
    
    // If uploading profile picture
    if (req.baseUrl.includes('/users') && req.path.includes('/profile-picture')) {
      uploadPath += 'profile-pictures/';
    } 
    // If uploading company logo
    else if (req.baseUrl.includes('/companies') && req.path.includes('/logo')) {
      uploadPath += 'company-logos/';
    }
    // If uploading for work orders
    else if (req.baseUrl.includes('/work-orders')) {
      uploadPath += 'work-orders/';
    }
    // If uploading for maintenance requests
    else if (req.baseUrl.includes('/requests')) {
      uploadPath += 'maintenance-requests/';
    }
    // If uploading for equipment
    else if (req.baseUrl.includes('/equipment')) {
      uploadPath += 'equipment/';
    }
    // If uploading for locations
    else if (req.baseUrl.includes('/locations')) {
      uploadPath += 'locations/';
    }
    // If uploading for store parts
    else if (req.baseUrl.includes('/store')) {
      uploadPath += 'store-parts/';
    }
    // Default upload folder for other files
    else {
      uploadPath += 'misc/';
    }

    // Create directory if it doesn't exist
    createDir(uploadPath);
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Create a unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure file filter
const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const allowedFileTypes = {
    'image/jpeg': true,
    'image/png': true,
    'image/gif': true,
    'application/pdf': true,
    'application/msword': true,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true,
    'application/vnd.ms-excel': true,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': true
  };

  if (allowedFileTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, PDF, DOC, DOCX, XLS, and XLSX files are allowed.'), false);
  }
};

// Configure upload settings
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Export upload middleware for various use cases
exports.uploadSingle = (fieldName) => {
  return upload.single(fieldName);
};

exports.uploadMultiple = (fieldName, maxCount = 5) => {
  return upload.array(fieldName, maxCount);
};

exports.uploadFields = (fields) => {
  return upload.fields(fields);
};

// Handle multer errors
exports.handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size exceeds 10MB limit' });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};