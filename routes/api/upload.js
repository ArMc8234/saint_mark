const router = require("express").Router();
const multer = require("multer");
const crypto = require('crypto');
const fs = require('fs');
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
    //Displays file array that was saved in a new window
    // res.json({
    //     fileArray
    // });
    // for (const element of req.files) {
  
    //     res.json({
        
    //     });  // imageUrl: "/images/uploads/" + fileName
    //       fileArray

    // }

    //Send the user back to the image upload page after a successful upload
     res.redirect('/imageUploader')
  }
  else res.status("409").json("No Files to Upload.");
});

// router.route("/").delete(upload.single("image"), (req , res) => {
//     if (req.body) {
//       let path = req;
//       try {
//         fs.unlink(path)
//       } catch(err){
//         console.log(err)
//       }
      
    
//   }
//   else res.status("409").json("No Files to Remove.");
// });

module.exports = router;
