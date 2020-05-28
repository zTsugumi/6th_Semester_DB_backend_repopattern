const Reservations = require('../models/reservations')

async function findAll(req) {
    return Reservations.find(req.query)
        .populate('user')
}

async function create(userId, data) {
    return Reservations.create({
        user: userId,
        reservations: data
    })
}

async function deleteAll() {
    return Reservations.deleteMany()
}

async function find(userId) {
    return Reservations.findOne({ 'user': userId })
}

async function findById(id) {
    return Reservations.findById(id)
        .populate('user')
}

async function update(id, data) {
    return Reservations.findByIdAndUpdate(id, {
        $set: data
    }, { new: true })
}

async function deleteOne(userId) {
    return Reservations.findOneAndDelete({ user: userId })
}

module.exports = {
    findAll,
    create,
    deleteAll,
    find,
    findById,
    deleteOne
}