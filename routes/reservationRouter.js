const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Reservations = require('../models/reservations');

const reservationRouter = express.Router();
reservationRouter.use(bodyParser.json());

reservationRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.jwtVerifyUser, (req, res, next) => {
        if (req.user.admin)                 // Admin has right to get all reservation
            Reservations.find(req.query)
                .populate('user')
                .then(
                    (reservations) => {

                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(reservations);
                    },
                    (err) => next(err)
                )
                .catch((err) => next(err));
        else
            Reservations.findOne({ 'user': req.user._id })
                .then(
                    (reservations) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(reservations);
                    },
                    (err) => next(err)
                )
                .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.jwtVerifyUser, (req, res, next) => {
        Reservations.findOne({ 'user': req.user._id })
            .then(
                (reservation) => {
                    if (!reservation) {         // If user doesn't exist                        
                        return Reservations.create({
                            user: req.user._id,
                            reservations: req.body
                        });
                    }
                    else {
                        if (reservation.reservations.find((item) => {
                            var tmp = new Date(req.body.date);
                            return (item.date.toString() === tmp.toString())
                        })) {
                            var error = new Error();
                            error.status = 403;
                            throw error;
                        }
                        else {
                            reservation.reservations.push(req.body);
                            console.log(reservation);
                            return reservation.save();
                        }
                    }
                },
                (err) => next(err)
            )
            .then(
                (reservation) => {
                    Reservations.findById(reservation._id)
                        .populate('user')
                        .then((reservation) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(reservation);
                        });
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;                   // operation not supported
        res.setHeader('Content-Type', 'text/plain');
        res.end('PUT not supported on /reservation');
    })
    .delete(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Reservations.remove({})
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

reservationRouter.route('/:resId1/:resId2')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;                   // operation not supported
        res.setHeader('Content-Type', 'text/plain');
        res.end('GET not supported on /reservation/' + req.params.resId1);
    })
    .post(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;                   // operation not supported
        res.setHeader('Content-Type', 'text/plain');
        res.end('POST not supported on /reservation' + req.params.resId1);
    })
    .put(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Reservations.findById(req.params.resId1)
            .then(
                (reservation) => {
                    var index = reservation.reservations.map((item) => item._id).indexOf(req.params.resId2);
                    var updateInfo = {
                        agree: req.body.agree ? req.body.agree : reservation.reservations[index].agree,
                        contactType: req.body.contactType ? req.body.contactType : reservation.reservations[index].contactType,
                        message: req.body.message ? req.body.message : reservation.reservations[index].message,
                        telnum: req.body.telnum ? req.body.telnum : reservation.reservations[index].telnum,
                        email: req.body.email ? req.body.email : reservation.reservations[index].email,
                        date: req.body.date ? req.body.date : reservation.reservations[index].date,
                        nGuest: req.body.nGuest ? req.body.nGuest : reservation.reservations[index].nGuest,
                        _id: reservation.reservations[index]._id
                    }
                    return updateInfo;
                },
                (err) => next(err)
            )
            .then(
                (updateInfo) => {
                    Reservations.findOneAndUpdate({ '_id': req.params.resId1, 'reservations._id': req.params.resId2 }, {
                        $set: { 'reservations.$': updateInfo }
                    }, { new: true })
                        .then(
                            (reservations) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(reservations);
                            },
                            (err) => next(err)
                        )
                        .catch((err) => next(err))
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Reservations.findById(req.params.resId1)
            .then(
                (reservations) => {
                    var index = reservations.reservations.map((item) => item._id).indexOf(req.params.resId2);                   
                    reservations.reservations.splice(index, 1);
                    reservations.save()
                        .then(
                            (response) => {
                                console.log(response);
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(response);
                            }
                        ),
                        (err) => next(err)
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

module.exports = reservationRouter;