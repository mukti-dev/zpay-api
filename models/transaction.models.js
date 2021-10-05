const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types

const TransactionSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        trim: true
    },
    amount: {
        type: String,
        trim: true
    },
    transactionid: {
        type: String,
        trim: true
    },
    naration: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    createdBy: {
        type: ObjectId,
        trim: true
    },
    modifiedAt: {
        type: Date,
        default: Date.now()
    },
    modifiedBy: {
        type: ObjectId
    },

})

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction