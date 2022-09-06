'use strict';

// Import General Modules
const express = require('express');
const path = require('path');
const serveIndex = require('serve-index');
// const fileUpload = require('express-fileupload');

// Import routers

const indexRouter = require('./routes/index');
const bicycleRouter = require('./routes/bicycles');
const userRouter = require('./routes/users');

// Get express object
let app = express();

// Set envs
const port = "3000";
const currentId = 'admin';
app.set('port', port);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// express settings
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(fileUpload());
app.use('/static', express.static(path.join(__dirname, '/')));
app.use(express.static(__dirname + "/"));
app.use('/static', serveIndex(__dirname + '/'));

// Setting Routers
app.use('/', indexRouter);
app.use('/bicycles', bicycleRouter);
app.use('/users', userRouter);

app.get('/upload', async (req, res, next) => {
  return res.send(`<html>
  <body>
    <form ref='uploadForm' 
      id='uploadForm' 
      action='/upload' 
      method='post' 
      encType="multipart/form-data">
        <input type="file" name="sampleFile" />
        <input type='submit' value='Upload!' />
    </form>     
  </body>
</html>`);
});

app.post('/upload', (req, res) => {
  let sampleFile;
  let uploadPath;
  console.log(req.files);

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded');
  }

  sampleFile = req.files.sampleFile;
  uploadPath = path.join(__dirname, 'static', 'img', sampleFile.name);
  console.log(uploadPath);
  sampleFile.mv(uploadPath, err => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send('File uploaded!');
  });
});

// Running server on specified port 
app.listen(port, () => {
  console.log(`Express server is running at port ${port}`);
});
