const createError = require('../helpers/createError')
const sendJsonResponse = require('../helpers/sendResponse')
const CommentRepo = require('../repository/CommentRepo')

async function findAll(req, res, next) {
    CommentRepo.findAll(req)
        .then(
            (comments) => sendJsonResponse(res, 200, comments),
            (err) => next(err)
        )
        .catch((err) => next(err));
}

async function create(req, res, next) {
    if (req.body != null) {
        req.body.author = req.user._id

        CommentRepo.create(req.body)
            .then(
                (comment) => {
                    CommentRepo.find(comment._id)
                    sendJsonResponse(res, 200, comment)
                },
                (err) => next(err)
            )
            .catch((err) => next(err))
    }
    else {
        err = new Error('Comment not found in request body')
        err.status = 404
        return next(err)
    }
}

async function deleteAll(req, res, next) {
    CommentRepo.deleteAll()
        .then(
            (response) => sendJsonResponse(res, 200, response),
            (err) => next(err)
        )
        .catch((err) => next(err))
}

async function find(req, res, next) {
    CommentRepo.find(req.params.commentId)
        .then(
            (comment) => sendJsonResponse(res, 200, comment),
            (err) => next(err)
        )
        .catch((err) => next(err))
}

async function update(req, res, next) {
    CommentRepo.find(req.params.commentId)
        .then(
            (comment) => {
                if (comment != null) {
                    if (!comment.author.equals(req.user._id))
                        return next(createError(403, 'You are not authorized to update this comment'))

                    req.body.author = req.user._id

                    CommentRepo.update(req.params.commentId, req.body)
                        .then(
                            (comment) => {
                                CommentRepo.find(comment._id)                                    
                                    .then(
                                        (comment) => sendJsonResponse(res, 200, comment),
                                        (err) => next(err)
                                    )
                            },
                            (err) => next(err)
                        )
                }
                else return next(createError(404, 'Comment ' + req.params.commentId + ' not found'))
            },
            (err) => next(err)
        )
        .catch((err) => next(err))
}

async function deleteOne(req, res, next) {
    CommentRepo.find(req.params.commentId)
        .then(
            (comment) => {
                if (comment != null) {
                    if (!comment.author.equals(req.user._id))
                        return next(createError(403, 'You are not authorized to update this comment'))
                    CommentRepo.deleteOne(req.params.commentId)
                        .then(
                            (response) => sendJsonResponse(res, 200, response),
                            (err) => next(err)
                        )
                }
                else return next(createError(404, 'Comment ' + req.params.commentId + ' not found'))
            },
            (err) => next(err)
        )
        .catch((err) => next(err))
}

module.exports = {
    findAll,
    create,
    deleteAll,
    find,
    update,
    deleteOne
}