const { getWalletData, getWalletDetail, getAllWallet, addNewTransaction, addNewWallet, updateWalletBalance, userWallet, razorpayRechargeTransactionManager } = require('../managers/wallet.manager')
const { successResponse, failureResponse } = require('../services/responseGenerator')
const razorpayConfig = require('../config/appConfig.json').RAZOR_PAY
const zpayConfig = require('../config/appConfig.json').ZPAY
const Razorpay = require('razorpay');


const walletHistory = async (req, res) => {
    try {
        console.log(req.params)
        const userId = req.params.userid
        const dateRange = req.body
        const walletData = await getWalletData(userId, dateRange)
        successResponse(req, res, walletData, 'Wallet data fetched successfully')
    } catch (error) {
        failureResponse(req, res, error)
    }

}

const walletDetail = async (req, res) => {
    try {
        const walletData = await getWalletDetail(req.params.walletid)
        successResponse(req, res, walletData, 'Wallet data fetched successfully')
    } catch (error) {
        failureResponse(req, res, error)
    }
}


const allWallet = async (req, res) => {
    try {
        const walletData = await getAllWallet()
        successResponse(req, res, walletData, 'All Wallet data fetched successfully')
    } catch (error) {
        failureResponse(req, res, error)
    }
}

const createOrder = (req, res) => {
    try {
        let amount = req.query.amount;

        let instance = new Razorpay({ key_id: razorpayConfig.key_id, key_secret: razorpayConfig.key_secret })

        let options = {
            amount: amount,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_12"
        };
        instance.orders.create(options, function (err, order) {
            if (err) {
                failureResponse(req, res, err)
            } else {
                successResponse(req, res, order, 'Order Generated')
            }

        });
    } catch (error) {
        failureResponse(req, res, error)
    }
}

const addMoney = async (req, res) => {
    try {
        let userid = req.body.userid;
        let amount = req.body.amount;
        let transactionid = req.body.transactionid;
        let status = req.body.status;
        let devSource = req.body.devSource;

        let newTransaction = {
            userId: userid,
            amount: amount,
            transactionid: transactionid,
            status: status,
            createdBy: userid,
            modifiedBy: userid,
        }

        const addTransaction = await addNewTransaction(newTransaction)
        // if (status === "Completed") {

        // }
        let wallet = {
            userid: userid,
            credit: amount,
            status: status,
            transactionid: addTransaction._id,
            transactionSource: devSource,
            naration: 'Recharge Amount :' + amount + ', TransactionId: ' + addTransaction._id,
            createdBy: userid,
            modifiedBy: userid
        }
        const addWallet = await addNewWallet(wallet)
        const updateWallet = await updateWalletBalance(userid, amount)
        successResponse(req, res, updateWallet, 'Money Added')
    } catch (error) {
        failureResponse(req, res, error)
    }
}

const rechargeTransaction = async (req, res) => {
    try {
        let data = {}
        data.userid = req.body.userid;
        data.name = req.body.name;
        data.phone = req.body.phone;
        data.amount = req.body.amount;
        data.cashback = req.body.cashback;
        data.tokenid = zpayConfig.tokenId;
        data.userid1 = zpayConfig.userId;
        data.optcode = req.body.optcode;
        data.state = req.body.state;
        data.devSource = req.body.devSource;

        const wallet = await userWallet(data)
        successResponse(req, res, wallet, 'Successful')
    } catch (error) {
        failureResponse(req, res, error)
    }
}

const razorpayRechargeTransaction = (req, res) => {
    try {

        let data = {}
        data.userid = req.body.userid;
        data.name = req.body.name;
        data.phone = req.body.phone;
        data.amount = req.body.amount;
        data.cashback = req.body.cashback;
        data.transactionid = req.query.transactionid;
        data.tokenid = zpayConfig.tokenId;
        data.userid1 = zpayConfig.userId;
        data.optcode = req.body.optcode;
        data.state = req.body.state;
        data.devSource = req.body.devSource;

        const wallet = razorpayRechargeTransactionManager(data)
        successResponse(req, res, wallet, 'Successful')
    } catch (error) {
        failureResponse(req, res, error)
    }
}

module.exports = { walletHistory, walletDetail, allWallet, createOrder, addMoney, rechargeTransaction, razorpayRechargeTransaction }