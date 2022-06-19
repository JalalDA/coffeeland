const cloudinary = require('cloudinary').v2

// eslint-disable-next-line no-undef
const { CLOUD_NAME, API_KEY, API_SECRET} = process.env;
const cloudinaryConfig = (req, res, next) => {
    cloudinary.config({ 
      cloud_name: CLOUD_NAME, 
      api_key: API_KEY, 
      api_secret: API_SECRET 
    });
    next();
  };

module.exports = cloudinaryConfig