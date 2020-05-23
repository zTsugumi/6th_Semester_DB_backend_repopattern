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
        Reservations.findOne({ 'user': req.user._id })
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
                        if (reservation.reservations.find((item) => item.date.toString() === req.body.date.toString())) {
                            var error = new Error("You have been reserved at this date");
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
                    console.log(reservation);
                    Reservations.findById(reservation._id)
                        .populate('user')
                        .then((reservation) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(reservation);
                        });
                }
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

module.exports = reservationRouter;