const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types
const RechargeSchema = new mongoose.Schema({
    // id: {
    //     type: mongoose.Types.ObjectId,
    //     // type: String,
    //     required: true,
    //     minlength: 1,
    //     trim: true
    // },
    // transactionId: {
    //     type: ObjectId,
    //     required: true,
    //     minlength: 1,
    //     trim: true
    // },
    // rechargeId: {
    //     type: ObjectId,
    //     required: true,
    //     minlength: 1,
    //     trim: true
    // },
    userid: {
        type: ObjectId,
        required: true,
        minlength: 1,
        trim: true
    },
    mobile: {
        type: String,
        // required: true,
        // minlength: 1,
        trim: true
    },
    amount: {
        type: Number,
        // required: true,
        // minlength: 1,
        trim: true
    },
    operator: {
        type: String,
        // required: true,
        // minlength: 1,
        trim: true
    },
    status: {
        type: String,
        // required: true,
        minlength: 1,
        trim: true
    },
    errormessage: {
        type: String,
        // required: true,
        // minlength: 1,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    createdBy: {
        type: ObjectId,
        // required: true,
    },
    modifiedAt: {
        type: Date,
        default: Date.now()
    },
    modifiedBy: {
        type: ObjectId,
        required: true,
    },

})

const Recharge = mongoose.model('Recharge', RechargeSchema);

module.exports = { Recharge }