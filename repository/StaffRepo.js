const Staffs = require('../models/staffs')

async function findAll(req) {
    return Staffs.find(req.query)
}

async function create(newStaff) {
    return Staffs.create(newStaff)
}

async function deleteAll() {
    return Staffs.deleteMany()
}

async function find(id) {
    return Staffs.findById(id)
}

async function update(id, data) {
    return Staffs.findByIdAndUpdate(id, {
        $set: data
    }, { new: true })
}

async function deleteOne(id) {
    return Staffs.findByIdAndRemove(id)
}

module.exports = {
    findAll,
    create,
    deleteAll,
    find,
    update,
    deleteOne
}