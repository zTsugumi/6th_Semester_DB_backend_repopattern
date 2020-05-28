const User = require('../models/user')

async function findAll() {
    return User.find();
}

async function create(newUser) {
    return new Promise((resolve, reject) => {
        User.register(new User({ username: newUser.username }), newUser.password, (err, user) => {
            if (err) return reject(err);

            if (newUser.firstname)
                user.firstname = newUser.firstname
            if (newUser.lastname)
                user.lastname = newUser.lastname
            user.save((err, user) => {
                if (err) return reject(err);
                resolve(user)
            })
        })
    })
}

async function deleteOne(deleteId) {
    return User.findByIdAndDelete(deleteId)
}

module.exports = {
    findAll,
    create,
    deleteOne
}