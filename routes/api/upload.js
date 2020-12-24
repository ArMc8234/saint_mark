const router = require("express").Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
require('dotenv').config();
const aws = require('aws-sdk');
const Galleries = require('./galleries');
const db = require('../../models');

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: "us-east-1"
})

//==============================================

//Multer-s3 storage

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

//-Generate the file name that will be used for the S3 bucket and save it to the Gallery dB
let keyName = '';
const generateKey =  (req, file, cb) => {
  keyName = Date.now().toString();
  cb(null, keyName);
  addNewURL(keyName)
}
 
const upload = multer({
  storage: multerS3({
    fileFilter,
    s3: s3,
    bucket: 'stmarkfiles7',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: generateKey,
    contentType: multerS3.AUTO_CONTENT_TYPE, 
    ACL: 'public-read'
  })
});

//- Create variable to hold the new AWS URL generated when a file is uploaded, then save the URL to the Galleries dB
let newURL;

router.route('/').post(upload.array('image'), function(req, res, next) {
  //  newURL = req.files[0].key;
  //  console.log("newURL: ", newURL)
   return res.render('imageUpload', { title: "ImageUpload" });
  // return res.json('Successfully uploaded ' + JSON.stringify(req.files[0].location) + ' files!')
  });

function addNewURL(name){
   db.Gallery.create({ imageURL: name }, function(res, err){
    if(err) {
      return (err)
    } else {
      console.log("Gallery URL saved from addNew!", name)

    }
  })
}

router.route('/:id').delete(  function(req, res, next) {
    console.log("S3 Data received: ", req)
    let params = {
      Bucket: 'stmarkfiles7',
      Key: req.params.id
    };
    s3.deleteObject(params, function(err, data) {
      if (err) {
        console.log(err, err.stack)
      } else {
        console.log("Successful S3 Object Deletion: ", data);
      }
    })
  });

module.exports = router;
