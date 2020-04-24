const express = require('express');
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));//donot need this line

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post("/api/posts", (req, res, next) => {
    const posts = req.body;
    console.log(posts);
    res.status(201).json({
      message: "Post added successfully"
    })
});


//can use app.get()
app.use('/api/posts', (req, res, next) => {
const posts = [
  {
    id: 'fad12421',
    title: 'First server side post',
    content: "This is coming from the server"
  },
  {
    d: 'ajs23243',
    title: 'Second server side post',
    content: "This is coming from the second server"
  }
];
  res.status(200).json({
    message: 'Posts fetched successfully',
    posts: posts
  });
});

module.exports = app;
