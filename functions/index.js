'use strict';

const functions = require('firebase-functions');

//set up firebase admin
const admin = require('firebase-admin');
admin.initializeApp();
const adminKey = require('./adminKey.json')

//start express stuff
const request = require('request');
const express = require('express');
const cors = require('cors')({origin: true});
const bodyParser = require('body-parser');
const app = express();
app.use(cors);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/bucket/:token', (req, res) => {

  //check token is valid (returned from signin), then continue to get bucket info
  admin.auth().verifyIdToken(req.params.token)
    .then((claims) => {
      // console.log(claims); // >> user info if needed

      //token promise will contain user's uid >> search for files with folder name of uid/Content
      //async await for all file metadata requests to clear, then return object with file info
      admin.storage().bucket().getFiles({prefix: claims.user_id + '/Content'})
        .then( async results => {

          const files = results[0];
          var downloadLinks = await Promise.all(files.map( async (file)=> {

            var token = file.metadata.metadata.firebaseStorageDownloadTokens;

            var fileName = file.name.replace(/\//g, '%2F'); //regex for replacing all instances of '/'
            var path = 'https://firebasestorage.googleapis.com/v0/b/' + 'venue-a2981.appspot.com/o/' + fileName + '?alt=media&token=' + token;

            var fileObj = {
              name: file.name.substr(file.name.indexOf('Content/')+8), //moves substring past 'Content/'
              url: path
            }

            //get metadata
            await file.getMetadata()
              .then(results => {
                fileObj.updated = results[0].updated;
                fileObj.size = results[0].size;
              }).catch(err => { console.log("metadata error") })

            return fileObj;
          }));

          console.log(downloadLinks)
          downloadLinks.shift(); //clear first (empty) link
          res.send({objects: downloadLinks});
        })
        //catch get error
        .catch(err => {
          console.log(err);
          res.send("error");
        });

    })
    //catch token error
    .catch((err) => {
      console.log(err);
      res.send("error");
    });
});

exports.venueApi = functions.https.onRequest(app);
