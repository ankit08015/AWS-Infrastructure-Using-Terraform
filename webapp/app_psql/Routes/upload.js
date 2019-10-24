const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const Busboy = require('busboy');

const BUCKET_NAME = 'webapp.dev.akshaymahajanshetti.me';
const IAM_USER_KEY = 'AKIA6O77IJUB742D73MU';
const IAM_USER_SECRET = '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';

function uploadToS3(file) {
  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    Bucket: BUCKET_NAME
  });
  s3bucket.createBucket(function () {
      var params = {
        Bucket: BUCKET_NAME,
        Key: file.name,
        Body: file.data
      };
      s3bucket.upload(params, function (err, data) {
        if (err) {
          console.log('error in callback');
          console.log(err);
        }
        console.log('success'+'--------------->>>>>');
        console.log(data);
      });
  });
}

//module.exports = (router) => {
  // The following is an example of making file upload with additional body
  // parameters.
  // To make a call with PostMan
  // Don't put any headers (content-type)
  // Under body:
  // check form-data
  // Put the body with "element1": "test", "element2": image file

  router.post('/api/upload', function (req, res, next) {
    // This grabs the additional parameters so in this case passing in
    // "element1" with a value.

    var busboy = new Busboy({ headers: req.headers });
    console.log("here");
    // The file upload has completed
    busboy.on('finish', function() {
      console.log('Upload finished');
      
      // Your files are stored in req.files. In this case,
      // you only have one and it's req.files.element2:
      // This returns:
      // {
      //    element2: {
      //      data: ...contents of the file...,
      //      name: 'Example.jpg',
      //      encoding: '7bit',
      //      mimetype: 'image/png',
      //      truncated: false,
      //      size: 959480
      //    }
      // }
      
      // Grabs your file object from the request.
      const file = req.files.element2;
      console.log(file);
      
      // Begins the upload to the AWS S3
      uploadToS3(file);
    });

    req.pipe(busboy);
    res.sendStatus(200);
  });
//}

module.exports = router;


// var s3 = AWS.S3(awsCredentials);
// s3.deleteObject({
//   Bucket: MY_BUCKET,
//   Key: 'some/subfolders/nameofthefile1.extension'
// },function (err,data){})

function deleteFromS3(file) {
  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    Bucket: BUCKET_NAME
  });
  s3bucket.deleteObject({
        Bucket: BUCKET_NAME,
        Key: file//.name//,
        //Body: file.data
      },function (err,data){
        if(err){
          console.log(err);
        }
        console.log(data);
      })
      // s3bucket.upload(params, function (err, data) {
      //   if (err) {
      //     console.log('error in callback');
      //     console.log(err);
      //   }
      //   console.log('success'+'--------------->>>>>');
      //   console.log(data.Location);
      // });
 // });
}



router.delete('/api/delete/:name', function (req, res, next) {
  // This grabs the additional parameters so in this case passing in
  // "element1" with a value.

  //var busboy = new Busboy({ headers: req.headers });
  console.log("here");
  // The file upload has completed
  //busboy.on('finish', function() {
    console.log('delete finished');
    
    // Grabs your file object from the request.
    const file = req.params.name;//;files.element2;
    console.log(file+"---------------------------------->>>>>>>");
    // Begins the upload to the AWS S3
    deleteFromS3(file);
  //});

  //req.pipe(busboy);
  res.sendStatus(200);
});

module.exports = router;
