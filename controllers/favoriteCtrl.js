const sendJsonResponse = require('../helpers/sendResponse')
const FavoriteRepo = require('../repository/FavoriteRepo')

async function findAll(req, res, next) {
    FavoriteRepo.findAll(req.user._id)
        .then(
            (favorites) => sendJsonResponse(res, 200, favorites),
            (err) => next(err)
        )
        .catch((err) => next(err));
}

async function create(req, res, next) {
    FavoriteRepo.findAll(req.user._id)
        .then(
            (favorites) => {
                if (!favorites)          // If user doesn't exist       
                    return FavoriteRepo.create(req.user._id, req.body)
                else {
                    for (let dish of req.body) {
                        if (favorites.dishes.find((item) => {
                            return item._id.toString() === dish._id.toString()
                        }))
                            continue
                        favorites.dishes.push(dish._id)
                    }
                    return favorites.save()
                }
            },
            (err) => next(err)
        )
        .then(
            (favorite) => {
                FavoriteRepo.find(favorite._id)
                    .then(
                        (favorite) => sendJsonResponse(res, 200, favorite),
                        (err) => next(err)
                    )
            },
            (err) => next(err)
        )
        .catch((err) => next(err))
}

async function createById(req, res, next) {
    FavoriteRepo.findAll(req.user._id)
        .then(
            (favorite) => {
                if (!favorite)          // If user doesn't exist             
                    return FavoriteRepo.create(req.user._id, req.params.dishId)
                else {
                    if (!favorite.dishes.find((item) => {
                        return item._id.toString() === req.params.dishId.toString()
                    }))
                        favorite.dishes.push(req.params.dishId)
                    return favorite.save()
                }
            },
            (err) => next(err)
        )
        .then(
            (favorite) => {
                FavoriteRepo.find(favorite._id)
                    .then(
                        (favorite) => sendJsonResponse(res, 200, favorite),
                        (err) => next(err)
                    )
            }
        )
        .catch((err) => next(err))
}

async function deleteAll(req, res, next) {
    FavoriteRepo.deleteAll(req.user._id)
        .then(
            (response) => sendJsonResponse(res, 200, response),
            (err) => next(err)
        )
        .catch((err) => next(err))
}

async function find(req, res, next) {
    FavoriteRepo.find(req.user._id)
        .then(
            (favorite) => {
                if (!favorite)
                    sendJsonResponse(res, 200, { "exists": false, "favorites": favorite })
                else {
                    if (favorite.dishes.indexOf(req.params.dishId) < 0)
                        sendJsonResponse(res, 200, { "exists": false, "favorites": favorite })
                    else
                        sendJsonResponse(res, 200, { "exists": true, "favorites": favorite })
                }
            },
            (err) => next(err)
        )
        .catch((err) => next(err))
}

async function deleteOne(req, res, next) {
    FavoriteRepo.findAll(req.user._id)
        .then(
            (favorite) => {
                if (favorite) {
                    var index = favorite.dishes.map(item => item._id).indexOf(req.params.dishId)

                    if (index >= 0) {
                        favorite.dishes.splice(index, 1)
                        favorite.save()
                            .then(
                                (favorite) => {
                                    FavoriteRepo.find(favorite._id)
                                        .then(
                                            (favorite) => sendJsonResponse(res, 200, favorite),
                                            (err) => next(err)
                                        )
                                },
                                (err) => next(err)
                            )
                            .catch((err) => next(err))
                    }
                    else
                        return sendJsonResponse(res, 404, 'Dish ' + req.params.dishId + ' not in favorite list')
                }
                else
                    return sendJsonResponse(res, 404, 'You do not have favorite list')
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
    deleteOne,
    createById
}