const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var reservationSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reservations: [
        {
            telnum: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                required: true,
                min: Date.now
            },
            agree: {
                type: Boolean,
                default: false
            },
            contactType: {
                type: String,
                default: ''
            },
            message: {
                type: String,
                default: ''
            }
        }
    ]
}, {
    timestamps: true
});

var Reservations = mongoose.model('Reservation', reservationSchema);

module.exports = Reservations;