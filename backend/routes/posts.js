const express = require("express");
const multer = require("multer");

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};
//router.post()
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if(isValid){
      error = null;
    }
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

const Post = require('../models/post');

router.post("", multer({storage: storage}).single("image"),(req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const posts = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename
    });
    posts.save().then(result => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          id: result._id,
          title: result.title,
          content: result.content,
          imagePath: result.imagePath
        }
      })
    });

});

router.put("/:id", multer({storage: storage}).single("image"), (req, res, next) => {
  console.log(req.file);
  let imagePath;
  if(req.file){
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  })
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({message: "Update successful!"});
  });
});


//can use app.get()
router.get('', (req, res, next) => {
  Post.find().then(documents => {
      console.log(documents);
      res.status(200).json({
          message: 'Posts fetched successfully',
          posts: documents
        });
      });

});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post){
      res.status(200).json(post);
    }else{
      res.status(404).json({message: "Post not found!"});
    }
  })
});

router.delete("/:id", (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({message: "Post deleted!"})
  });
});

module.exports = router;
