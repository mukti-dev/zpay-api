const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types

const LoginSchema = new mongoose.Schema({
    userId: {
        // type: mongoose.Types.ObjectId,
        type: ObjectId,
        required: true,
        minlength: 1,
        trim: true
    },
    ipAddress: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    macAddresss: {
        type: String,
        required: true,
        trim: true
    },
    deviceType: {
        type: String,
        required: true,
        trim: true
    },

    deviceToken: {
        type: String,
        required: true,
        trim: true,
        default: ""
    },
    location: {
        lat: {
            type: String,
            required: true,
            trim: true

        },
        long: {
            type: String,
            required: true,
            trim: true

        },

    },
    logintime: {
        type: Date,
        required: true,
        default: Date.now()
    },


})

const Login = mongoose.model('Login', LoginSchema);

module.exports = { Login }