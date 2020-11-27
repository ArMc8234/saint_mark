const router = require("express").Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
// const crypto = require('crypto');
// const fs = require('fs');
const aws = require('aws-sdk');
const config = require('../../.aws/config');
// const config = require('../config')
// const GridFsStorage = require('multer-gridfs-storage');
// const Grid = require('gridfs-stream');
// const S3_BUCKET = process.env.S3_BUCKET;
// aws.config.region = 'eu-west-1';
// //Initialize gfs
// let gfs;
aws.config.update({
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  accessKeyId: config.AWS_ACCESS_KEY,
  
})

// const SESConfig = {
//   apiVersion: "2010-12-01",
//   accessKeyId: process.env.AWS_ACCESS_KEY,
//   accessSecretKey: process.env.AWS_SECRET_KEY,
//   region: "us-east-1"
// }
// AWS.config.update(SESConfig);
// var sns = new AWS.SNS();
//==========================================
// Multer Upload for local storage
// var storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images/uploads");
//   },
//   filename: (req, file, cb) => {
//     // Removed Date.now() to make a simpler file name to find from the front end
//     // cb(null, Date.now() + "-" + file.originalname);
//     cb(null, file.originalname);
//   }
// });
// const upload = multer({ storage });

  // router.route("/").post(upload.array("image"), (req, res) => {
  //     if (req.files) {
  //     const fileArray = [];
  //     for(i=0; i < req.files.length; i++){
  //       let fileName = "/images/uploads/" + req.files[i].filename;
  //       fileArray.push(fileName)
  //       console.log("Server upload:", fileName);
        
  //     }
  //     //Displays file array that was saved in a new window
  //     // res.json({
  //     //     fileArray
  //     // });
  //     // for (const element of req.files) {
    
  //     //     res.json({
          
  //     //     });  // imageUrl: "/images/uploads/" + fileName
  //     //       fileArray
  
  //     // }
  
  //     //Send the user back to the image upload page after a successful upload
  //      res.redirect('/imageUploader')
  //   }
  //   else res.status("409").json("No Files to Upload.");
  // });
//==============================================

//Multer-s3 storage

var s3 = new aws.S3()
 
var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'stmarkfiles7',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    },
      ACL: 'public-read'
  })
})

router.route('/').post(upload.array('image'), function(req, res, next) {
  res.send('Successfully uploaded ' + req.files.length + ' files!')
});

module.exports = router;
