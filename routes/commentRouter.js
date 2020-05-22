const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Comments = require('../models/comments');

const commentRouter = express.Router();
commentRouter.use(bodyParser.json());

commentRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Comments.find(req.query)
            .populate('author')
            .then(
                (comments) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(comments);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.jwtVerifyUser, (req, res, next) => {
        if (req.body != null) {
            req.body.author = req.user._id;
            Comments.create(req.body)
                .then(
                    (comment) => {
                        Comments.findById(comment._id)
                            .populate('author')
                            .then((comment) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(comment);
                            })
                    },
                    (err) => next(err)
                )
                .catch((err) => next(err));
        }
        else {
            err = new Error('Comment not found in request body');
            err.status = 404;
            return next(err);
        }
    })
    .put(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;                   // operation not supported
        res.setHeader('Content-Type', 'text/plain');
        res.end('PUT not supported on /comments');
    })
    .delete(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Comments.remove({})
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

commentRouter.route('/:commentId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Comments.findById(req.params.commentId)
            .populate('author')
            .then(
                (comment) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(comment);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.jwtVerifyUser, (req, res, next) => {
        res.statusCode = 403;                   // operation not supported
        res.setHeader('Content-Type', 'text/plain');
        res.end('POST not supported on /comments/' + req.params.commentId);
    })
    .put(cors.corsWithOptions, authenticate.jwtVerifyUser, (req, res, next) => {      // ?? Can give admin right to put ??
        Comments.findById(req.params.commentId)
            .then(
                (comment) => {
                    if (comment != null) {
                        if (!comment.author.equals(req.user._id)) {
                            var err = new Error('You are not authorized to update this comment');
                            err.status = 403;
                            return next(err);
                        }
                        req.body.author = req.user._id;
                        Comments.findByIdAndUpdate(req.params.commentId, {
                            $set: req.body
                        }, { new: true })
                            .then(
                                (comment) => {
                                    Comments.findById(comment._id)
                                        .populate('author')
                                        .then((comment) => {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json(comment);
                                        })
                                },
                                (err) => next(err)
                            );
                    }
                    else {
                        var err = new Error('Comment ' + req.params.commentId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.jwtVerifyUser, (req, res, next) => {   // ?? Can give admin right to delete ??
        Comments.findById(req.params.commentId)
            .then(
                (comment) => {
                    if (comment != null) {
                        if (!comment.author.equals(req.user._id)) {
                            var err = new Error('You are not authorized to update this comment');
                            err.status = 403;
                            return next(err);
                        }
                        Comments.findByIdAndRemove(req.params.commentId)
                            .then(
                                (response) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(response);
                                },
                                (err) => next(err)
                            )
                            .catch((err) => next(err));
                    }
                    else {
                        err = new Error('Comment ' + req.params.commentId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    });

module.exports = commentRouter;