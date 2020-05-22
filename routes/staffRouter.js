const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Staffs = require('../models/staffs');

const staffRouter = express.Router();
staffRouter.use(bodyParser.json());

staffRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Staffs.find(req.query)
            .then(
                (staffs) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(staffs);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Staffs.create(req.body)
            .then(
                (staff) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(staff);
                    console.log('staff Created: ', staff);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;                   // operation not supported
        res.setHeader('Content-Type', 'text/plain');
        res.end('PUT not supported on /staffs');
    })
    .delete(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Staffs.deleteMany({})
            .then(
                (response) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(response);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    });

staffRouter.route('/:staffId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Staffs.findById(req.params.staffId)
            .then(
                (staff) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(staff);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;                   // operation not supported
        res.setHeader('Content-Type', 'text/plain');
        res.end('POST not supported on /staffs/' + req.params.staffId);
    })
    .put(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leaders.findByIdAndUpdate(req.params.staffId, {
            $set: req.body
        }, { new: true })
            .then(
                (staff) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(staff);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leaders.findByIdAndRemove(req.params.staffId)
            .then(
                (response) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(response);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    });

module.exports = staffRouter;