const sendJsonResponse = require('../helpers/sendResponse')
const StaffRepo = require('../repository/StaffRepo')

async function findAll(req, res, next) {
    StaffRepo.findAll(req)
        .then(
            (staffs) => sendJsonResponse(res, 200, staffs),
            (err) => next(err)
        )
        .catch((err) => next(err));
}

async function create(req, res, next) {
    StaffRepo.create(req.body)
        .then(
            (staff) => sendJsonResponse(res, 200, staff),
            (err) => next(err)
        )
        .catch((err) => next(err))
}

async function deleteAll(req, res, next) {
    StaffRepo.deleteAll()
        .then(
            (response) => sendJsonResponse(res, 200, response),
            (err) => next(err)
        )
        .catch((err) => next(err))
}

async function find(req, res, next) {
    StaffRepo.find(req.params.staffId)
        .then(
            (staff) => sendJsonResponse(res, 200, staff),
            (err) => next(err)
        )
        .catch((err) => next(err))
}

async function update(req, res, next) {
    StaffRepo.update(req.params.staffId, req.body)
        .then(
            (staff) => sendJsonResponse(res, 200, staff),
            (err) => next(err)
        )
        .catch((err) => next(err))
}

async function deleteOne(req, res, next) {
    StaffRepo.deleteOne(req.params.staffId)
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