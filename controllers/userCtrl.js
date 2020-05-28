var passport = require('passport')
var authenticate = require('../helpers/authenticate')
const sendJsonResponse = require('../helpers/sendResponse')
const UserRepo = require('../repository/UserRepo')

async function findAll(req, res, next) {
    UserRepo.findAll()
        .then(
            (users) => sendJsonResponse(res, 200, users),
            (err) => next(err)
        )
        .catch((err) => next(err))
}

async function create(req, res, next) {
    var newUser = {
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname ? req.body.firstname : null,
        lastname: req.body.lastname ? req.body.lastname : null
    }
    UserRepo.create(newUser)
        .then(
            (user) => sendJsonResponse(res, 200, { success: true }),
            (err) => next(err)
        )
        .catch((err) => next(err))
}

async function login(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err)

        if (!user)
            return sendJsonResponse(res, 401, { success: false })

        req.logIn(user, (err) => {
            if (err) sendJsonResponse(res, 401, { success: false })

            var token = authenticate.getToken({ _id: req.user._id })

            sendJsonResponse(res, 200, { success: true, token: token, isAdmin: req.user.admin })
        })
    })(req, res, next)
}

module.exports = {
    findAll,
    create,
    login
}