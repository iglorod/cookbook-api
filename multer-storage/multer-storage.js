const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

const s3 = new aws.S3({ 
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_KEY,
    Bucket: 'cookbook.iglorod'
})

module.exports = multerS3({
    s3: s3,
    bucket: 'cookbook.iglorod/recipe-title-images',
    acl: 'public-read',
    key: function (req, file, cb) {
        if (!file) return;
     cb(null, new Date().getTime() + file.originalname)
    }
});
