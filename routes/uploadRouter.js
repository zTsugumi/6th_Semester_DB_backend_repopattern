const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        var err = new Error('You can upload only image files!');
        return callback(err, false);
    }
    else {
        callback(null, true);
    }
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.jwtVerifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;                   // operation not supported
        res.end('GET not supported on /imageUpload');
    })
    .post(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
        // we don't need next here because err is handled already in upload
        // if upload success => pass result to req
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file);
    })
    .put(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;                   // operation not supported
        res.end('PUT not supported on /imageUpload');
    })
    .delete(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;                   // operation not supported
        res.end('DELETE not supported on /imageUpload');
    })

module.exports = uploadRouter;