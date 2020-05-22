const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var staffSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        require: true
    },
    description: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

var Staffs = mongoose.model('Staff', staffSchema);

module.exports = Staffs;