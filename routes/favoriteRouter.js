var express = require('express');
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');
const cors = require('./cors');

var Favorites = require('../models/favorites');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.jwtVerifyUser, (req, res, next) => {
        Favorites.findOne({ 'user': req.user._id })
            .populate('user')
            .populate('dishes')
            // .exec((err, favorites) => {
            //     if (err) return next(err);
            //     res.statusCode = 200;
            //     res.setHeader('Content-Type', 'application/json');
            //     res.json(favorites);
            // })
            .then(
                (favorites) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.jwtVerifyUser, (req, res, next) => {
        Favorites.findOne({ 'user': req.user._id })
            .then(
                (favorite) => {
                    if (!favorite) {         // If user doesn't exist                        
                        return Favorites.create({
                            user: req.user._id,
                            dishes: req.body
                        });
                    }
                    else {
                        for (let dish of req.body) {
                            if (favorite.dishes.find((item) => {
                                return item._id.toString() === dish._id.toString();
                            }))
                                continue;
                            favorite.dishes.push(dish._id);
                        }
                        return favorite.save();
                    }
                },
                (err) => next(err)
            )
            .then(
                (favorite) => {
                    Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        });
                }
            )
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.jwtVerifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        res.end('PUT operation is not supported on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.jwtVerifyUser, (req, res, next) => {
        Favorites.findOneAndDelete({ user: req.user._id })
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

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.jwtVerifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then(
                (favorite) => {
                    if (!favorite) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        return res.json({ "exists": false, "favorites": favorite });
                    }
                    else {
                        if (favorite.dishes.indexOf(req.params.dishId) < 0) {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            return res.json({ "exists": false, "favorites": favorite });
                        }
                        else {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            return res.json({ "exists": true, "favorites": favorite });
                        }
                    }
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.jwtVerifyUser, (req, res, next) => {
        Favorites.findOne({ 'user': req.user._id })
            .then(
                (favorite) => {
                    if (!favorite) {         // If user doesn't exist                        
                        return Favorites.create({
                            user: req.user._id,
                            dishes: req.params.dishId
                        });
                    }
                    else {
                        if (!favorite.dishes.find((item) => {
                            return item._id.toString() === req.params.dishId.toString();
                        }))
                            favorite.dishes.push(req.params.dishId);
                        return favorite.save();
                    }
                },
                (err) => next(err)
            )
            .then(
                (favorite) => {
                    Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        });
                }
            )
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.jwtVerifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        res.end('PUT operation is not supported on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.jwtVerifyUser, (req, res, next) => {
        Favorites.findOne({ 'user': req.user._id })
            .then(
                (favorite) => {
                    if (favorite) {
                        var index = favorite.dishes.indexOf(req.params.dishId);

                        if (index >= 0) {
                            favorite.dishes.splice(index, 1);
                            favorite.save()
                                .then(
                                    (favorite) => {
                                        Favorites.findById(favorite._id)
                                            .populate('user')
                                            .populate('dishes')
                                            .then((favorite) => {
                                                res.statusCode = 200;
                                                res.setHeader('Content-Type', 'application/json');
                                                res.json(favorite);
                                            });
                                    },
                                    (err) => next(err)
                                )
                                .catch((err) => next(err));
                        }
                        else {
                            res.statusCode = 404;
                            res.setHeader('Content-Type', 'text/plain');
                            res.end('Dish ' + req.params.dishId + ' not in favorite list');
                        }
                    }
                    else {
                        res.statusCode = 404;
                        res.setHeader('Content-Type', 'text/plain');
                        res.end('You do not have favorite list');
                    }
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    });

module.exports = favoriteRouter; 