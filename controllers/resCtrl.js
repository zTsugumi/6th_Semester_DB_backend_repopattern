const sendJsonResponse = require('../helpers/sendResponse')
const ResRepo = require('../repository/ResRepo')
const Reservations = require('../models/reservations')

async function findAll(req, res, next) {
    if (req.user.admin)                 // Admin has right to get all reservation
        ResRepo.findAll(req)
            .then(
                (reservations) => sendJsonResponse(res, 200, reservations),
                (err) => next(err)
            )
            .catch((err) => next(err))
    else
        ResRepo.find(req.user._id)
            .then(
                (reservations) => sendJsonResponse(res, 200, reservations),
                (err) => next(err)
            )
            .catch((err) => next(err))
}

async function create(req, res, next) {
    ResRepo.find(req.user._id)
        .then(
            (reservation) => {
                if (!reservation) {         // If user doesn't exist                        
                    return ResRepo.create(req.user._id, req.body)
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
                        return reservation.save();
                    }
                }
            },
            (err) => next(err)
        )
        .then(
            (reservation) => {
                ResRepo.findById(reservation._id)
                    .then(
                        (reservation) => sendJsonResponse(res, 200, reservation),
                        (err) => next(err)
                    )
                    .catch((err) => next(err))
            },
            (err) => next(err)
        )
        .catch((err) => next(err));
}

async function deleteAll(req, res, next) {
    ResRepo.deleteAll()
        .then(
            (response) => sendJsonResponse(res, 200, response),
            (err) => next(err)
        )
        .catch((err) => next(err))
}

async function update(req, res, next) {
    ResRepo.findById(req.params.resId1)
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
                        (reservations) => sendJsonResponse(res, 200, reservations),
                        (err) => next(err)
                    )
                    .catch((err) => next(err))
            },
            (err) => next(err)
        )
        .catch((err) => next(err))
}

async function deleteOne(req, res, next) {
    Reservations.findById(req.params.resId1)
        .then(
            (reservations) => {
                var index = reservations.reservations.map((item) => item._id).indexOf(req.params.resId2);
                reservations.reservations.splice(index, 1);
                reservations.save()
                    .then(
                        (response) => sendJsonResponse(res, 200, response),
                        (err) => next(err)
                    )
                    .catch((err) => next(err))
            },
            (err) => next(err)
        )
        .catch((err) => next(err));
}

module.exports = {
    findAll,
    create,
    deleteAll,
    update,
    deleteOne
}