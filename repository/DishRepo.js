const Dishes = require('../models/dishes')

async function findAll(req) {
    return Dishes.find(req.query)
}

async function create(newDish) {
    return Dishes.create(newDish)
}

async function deleteAll() {
    return Dishes.deleteMany()
}

async function find(id) {
    return Dishes.findById(id)
}

async function update(id, data) {
    return Dishes.findByIdAndUpdate(id, {
        $set: data
    }, { new: true })
}

async function deleteOne(id) {
    return Dishes.findByIdAndRemove(id)
}

module.exports = {
    findAll,
    create,
    deleteAll,
    find,
    update,
    deleteOne
}