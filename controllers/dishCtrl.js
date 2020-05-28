const sendJsonResponse = require('../helpers/sendResponse')
const DishRepo = require('../repository/DishRepo')

async function findAll(req, res, next) {
    DishRepo.findAll(req)
        .then(
            (dishes) => sendJsonResponse(res, 200, dishes),
            (err) => next(err)
        )
        .catch((err) => next(err));
}

async function create(req, res, next) {
    DishRepo.create(req.body)
        .then(
            (dish) => sendJsonResponse(res, 200, dish),
            (err) => next(err)
        )
        .catch((err) => next(err))
}

async function deleteAll(req, res, next) {
    DishRepo.deleteAll()
        .then(
            (response) => sendJsonResponse(res, 200, response),
            (err) => next(err)
        )
        .catch((err) => next(err))
}

async function find(req, res, next) {
    DishRepo.find(req.params.dishId)
        .then(
            (dish) => sendJsonResponse(res, 200, dish),
            (err) => next(err)
        )
        .catch((err) => next(err))
}

async function update(req, res, next) {
    DishRepo.update(req.params.dishId, req.body)
        .then(
            (dish) => sendJsonResponse(res, 200, dish),
            (err) => next(err)
        )
        .catch((err) => next(err))
}

async function deleteOne(req, res, next) {
    DishRepo.deleteOne(req.params.dishId)
        .then(
            (response) => sendJsonResponse(res, 200, response),
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