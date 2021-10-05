const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types
const { encryptText } = require('../helper/encryptDecrypt')

const UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    walletBalance: {
        type: Number,
        required: true,
        minlength: 1,
        trim: true,
        default: 0.00
    },
    status: {
        type: String,
        trim: true,
        default: 'Active'
    },
    deviceType: {
        type: String,
        required: true,
        trim: true,
        default: ""
    },

    deviceToken: {
        type: String,
        required: true,
        trim: true,
        default: ""
    },
    password: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    modifiedAt: {
        type: Date,
        default: Date.now()
    },
    modifiedBy: {
        type: ObjectId,
    },
    userType: {
        type: String,
        default: "customer"
    }

})


UsersSchema.pre("save", async function (next) {
    const userData = this

    if (this.isModified("password") || this.isNew) {
        let pw = await encryptText(userData.password)
        userData.password = pw
        next()

    } else {
        return next()
    }
})


const Users = mongoose.model('Users', UsersSchema);

module.exports = Users