const Comments = require('../models/comments')

async function findAll(req) {
    return Comments.find(req.query)
        .populate('author')
}

async function create(newComment) {
    return Comments.create(newComment)
}

async function deleteAll() {
    return Comments.deleteMany()
}

async function find(id) {
    return Comments.findById(id)
        .populate('author')
}

async function update(id, data) {
    return Comments.findByIdAndUpdate(id, {
        $set: data
    }, { new: true })
}

async function deleteOne(id) {
    return Comments.findByIdAndRemove(id)
}

module.exports = {
    findAll,
    create,
    deleteAll,
    find,
    update,
    deleteOne
}