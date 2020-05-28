const Favorites = require('../models/favorites')

async function findAll(userId) {
    return Favorites.findOne({ 'user': userId })
        .populate('user')
        .populate('dishes')
}

async function create(userId, data) {
    return Favorites.create({
        user: userId,
        dishes: data
    })
}

async function deleteAll(userId) {
    return Favorites.findOneAndDelete({ user: userId })
}

async function find(id) {
    return Favorites.findById(id)
        .populate('user')
        .populate('dishes')
}

async function deleteOne(id) {
    return Favorites.findByIdAndRemove(id)
}

module.exports = {
    findAll,
    create,
    deleteAll,
    find,
    deleteOne
}