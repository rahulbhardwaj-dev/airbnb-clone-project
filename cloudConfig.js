//We have to tell our code that these are cloudinary or our cloud space's credentials

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({ // giving credentals of our cloudinary account
    cloud_name: process.env.CLOUD_NAME ,
    api_key: process.env.CLOUD_API_KEY ,
    api_secret: process.env.CLOUD_API_SECRET
})

//defining our Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormats: ["png","jpg","jpeg"],
  },
});

module.exports = {
    cloudinary,
    storage
}
