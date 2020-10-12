const router = require("express").Router();
const multer = require("multer");
const crypto = require('crypto');
// const GridFsStorage = require('multer-gridfs-storage');
// const Grid = require('gridfs-stream');

// //Initialize gfs
// let gfs;

// Multer Upload
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/uploads");
  },
  filename: (req, file, cb) => {
    // Removed Date.now() to make a simpler file name to find from the front end
    // cb(null, Date.now() + "-" + file.originalname);
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

router.route("/").post(upload.array("image"), (req, res) => {
    if (req.files) {
    const fileArray = [];
    for(i=0; i < req.files.length; i++){
      let fileName = "/images/uploads/" + req.files[i].filename;
      fileArray.push(fileName)
      console.log("Server upload:", fileName);
      
    }
    res.json({
        fileArray
    });
    // for (const element of req.files) {
  
    //     res.json({
        
    //     });  // imageUrl: "/images/uploads/" + fileName
    //       fileArray

    // }
  }
  else res.status("409").json("No Files to Upload.");
});

module.exports = router;
