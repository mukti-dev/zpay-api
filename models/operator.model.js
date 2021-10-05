const mongoose = require('mongoose');

const OperatorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    operatorCode: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    cashbackPercentageForZpay: {
        type: String,
        // required: true,
        // minlength: 1,
        trim: true
    },
    cashbackPercentageForCustomer: {
        type: String,
        // required: true,
        // minlength: 1,
        trim: true
    },
    status: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },

})

const Operator = mongoose.model('Operator', OperatorSchema);

module.exports = Operator