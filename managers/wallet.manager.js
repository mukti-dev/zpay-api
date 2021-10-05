const { Wallet } = require('../models/wallet.models')
const { ObjectId } = require('mongoose').Types
const Transaction = require('../models/transaction.models')
const Users = require('../models/users.models')
const { Recharge } = require('../models/recharge.models')
const axios = require('axios')
const { UpgradeRequiredError, InternalServerError } = require('../_errorHandler/error')

const { getUserById } = require('../managers/user.manager')
const { addRechargeManager } = require('../managers/recharge.manager')


const getWalletData = async (userId, reqBody) => {
    try {
        let query
        if (reqBody.startDate && reqBody.endDate) {
            query = {
                $and: [{ userid: userId }, {
                    "createdAt": {
                        "$gte": reqBody.startDate,
                        "$lt": reqBody.endDate
                    }
                }]
            }
        } else {
            query = { userid: userId }
        }
        console.log(JSON.stringify(query))
        const walletData = await Wallet.find(query).exec()
        return walletData

    } catch (error) {
        throw error
    }

}
const getWalletDetail = async (rechargeId) => {
    try {
        return await Wallet.find({ _id: new ObjectId(rechargeId) }).exec()


    } catch (error) {
        throw error
    }
}


const getAllWallet = async () => {
    try {
        // return await Wallet.find({}).exec()
        const result = await Wallet.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userid',
                    foreignField: '_id',
                    as: 'userDetail'
                }
            },

        ]).exec()
        console.log(result.length)
        const data = JSON.parse(JSON.stringify(result))

        let response = []
        let total = 0
        for (let i = 0; i < data.length; i++) {


            let service = "N/A"
            let operator = "N/A"
            let phone = ""
            if (data[i].service) {
                service = data[i].service
            }
            if (data[i].operator) {
                operator = data[i].operator
            }
            if (data[i].userDetail.length > 0) {
                phone = data[i].userDetail[0].phone
            }

            let credit = data[i].credit ? data[i].credit : 0
            let debit = data[i].debit ? data[i].debit : 0
            total = total + parseFloat(credit) - parseFloat(debit)

            let obj = {
                mobile: phone,
                services: service,
                operator: operator,
                naration: data[i].naration,
                credit: credit,
                debit: debit,
                total: total
            }
            if (data[i].userDetail.length > 0) {
                response.push(obj)
            }

        }
        return response
    } catch (error) {
        throw error
    }
}
const addNewTransaction = async (reqBody) => {
    try {
        const transaction = new Transaction(reqBody)
        return transaction.save()
    } catch (error) {
        throw error
    }
}

const addNewWallet = async (reqBody) => {
    try {
        const wallet = new Wallet(reqBody)
        return wallet.save()
    } catch (error) {
        throw error
    }

}

const updateWalletBalance = async (userid, amount) => {
    try {
        let user = await Users.findOne({ _id: new ObjectId(userid) }).exec()
        let walletBalance = user.walletBalance;
        let newWalletBalance = parseFloat(walletBalance) + parseFloat(amount)
        await Users.updateOne({ _id: new ObjectId(userid) }, { walletBalance: newWalletBalance }, { new: true }).exec()
        delete user.password
        delete user.__v
        delete user.walletBalance
        user.walletBalance = newWalletBalance
        return user
    } catch (error) {
        throw error
    }

}

const rechargeTransactionManager = async (reqBody) => {
    try {
        let userid = reqBody.userid
        let name = reqBody.name
        let phone = reqBody.phone
        let amount = reqBody.amount
        let cashback = reqBody.cashback
        let tokenid = reqBody.tokenid
        let userid1 = reqBody.userid1
        let optcode = reqBody.optcode
        let state = reqBody.state
        let devSource = reqBody.devSource

        let wallet = await Wallet.aggregate([{ $match: { userid: new ObjectId(userid) } }, { $group: { _id: "$userid", creditsum: { $sum: "$credit" }, debitsum: { $sum: "$debit" } } }]).exec()

        let bal = wallet[0].creditsum - wallet[0].debitsum;

        if (bal >= amount) {
            return new Promise(async (resolve, reject) => {
                let post_data = JSON.stringify({
                    "Customernumber": phone,
                    "Tokenid": tokenid,
                    "Userid": userid1,
                    "Amount": amount,
                    "Optcode": optcode,
                    "Yourrchid": "Your Recharge Unique Id",
                });

                let config = {
                    method: 'post',
                    url: 'https://www.zpay.co.in/Recharge/Recharge',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: post_data
                };

                axios(config).then(async (response) => {
                    if (response.data.Status == "Failed") {
                        let recharge = {
                            transactionId: 'test',
                            userid: userid,
                            mobile: phone,
                            amount: amount,
                            operator: optcode,
                            status: response.data.Status,
                            createdBy: userid,
                            modifiedBy: userid,
                        }
                        await addRechargeManager(recharge)


                        reject(new InternalServerError(response.data.Errormsg))
                    }
                    if (response.data.Status == 'Success') {
                        if (parseFloat(amount) > 0) {
                            let newWallet1 = {
                                userid: userid,
                                debit: amount,
                                transactionSource: devSource,
                                naration: 'For RechargeId: ' + response.data.RechargeID + ', and TransactionId: ' + response.data.Transid,
                                status: response.data.Status,
                                createdBy: userid,
                                modifiedBy: userid
                            };
                            let addWalttet = await addNewWallet(newWallet1)
                        }
                        if (parseFloat(cashback) > 0) {
                            let newWallet1 = {
                                userid: userid,
                                credit: cashback,
                                transactionSource: devSource,
                                naration: 'For RechargeId: ' + response.data.RechargeID + ', and TransactionId: ' + response.data.Transid,
                                status: response.data.Status,
                                createdBy: userid,
                                modifiedBy: userid
                            };
                            let addWalttet = await addNewWallet(newWallet1)
                        }

                        const recharge = {
                            transactionId: response.data.Transid,
                            rechargeId: response.data.RechargeID,
                            userid: userid,
                            mobile: phone,
                            amount: amount,
                            operator: optcode,
                            status: response.data.Status,
                            createdBy: userid,
                            modifiedBy: userid,
                        }
                        const addRecharge = await addRechargeManager(recharge)

                        const userData = await getUserById(userid)

                        let walletBalance = userData.walletBalance;
                        let newWalletBalance = parseFloat(walletBalance) - parseFloat(amount) + parseFloat(cashback)


                        Users.findOneAndUpdate({ _id: new ObjectId(userid) }, {
                            walletBalance: newWalletBalance,
                        }, {
                            new: true
                        }).then((user) => {

                            console.log(newWalletBalance)
                            // res.status(200).send(user);
                            resolve(user)

                        });

                    }
                }).catch((error) => {
                    console.log(error)
                    throw error
                })
            })


        } else {
            throw new UpgradeRequiredError("Low Balance.")
        }
    } catch (error) {
        throw error
    }


}

const razorpayRechargeTransactionManager = async (reqBody) => {
    try {
        let userid = reqBody.userid
        let name = reqBody.name
        let phone = reqBody.phone
        let amount = reqBody.amount
        let cashback = reqBody.cashback
        let transactionid = reqBody.transactionid
        let tokenid = reqBody.tokenid
        let userid1 = reqBody.userid1
        let optcode = reqBody.optcode
        let state = reqBody.state
        let devSource = reqBody.devSource

        let wallet = await Wallet.aggregate([{ $match: { userid: new ObjectId(userid) } }, { $group: { _id: "$userid", creditsum: { $sum: "$credit" }, debitsum: { $sum: "$debit" } } }]).exec()

        let bal = wallet[0].creditsum - wallet[0].debitsum;

        if (bal >= amount) {
            return new Promise(async (resolve, reject) => {
                let post_data = JSON.stringify({
                    "Customernumber": phone,
                    "Tokenid": tokenid,
                    "Userid": userid1,
                    "Amount": amount,
                    "Optcode": optcode,
                    "Yourrchid": "Your Recharge Unique Id",
                });

                let config = {
                    method: 'post',
                    url: 'https://www.zpay.co.in/Recharge/Recharge',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: post_data
                };

                axios(config).then(async (response) => {
                    if (response.data.Status == "Failed") {
                        let recharge = {
                            transactionId: 'test',
                            userid: userid,
                            mobile: phone,
                            amount: amount,
                            operator: optcode,
                            status: response.data.Status,
                            createdBy: userid,
                            modifiedBy: userid,
                        }
                        await addRechargeManager(recharge)

                        reject(new InternalServerError(response.data.Errormsg))
                    }
                    if (response.data.Status == 'Success') {

                        let transaction = new Transaction({
                            userId: userid,
                            amount: amount,
                            transactionid: transactionid,
                            status: response.data.Status,
                            createdBy: userid,
                            modifiedBy: userid,
                        })
                        console.log(transaction)
                        await transaction.save()




                        if (parseFloat(amount) > 0) {
                            let newWallet1 = {
                                userid: userid,
                                debit: amount,
                                transactionSource: devSource,
                                naration: 'For RechargeId: ' + response.data.RechargeID + ', and TransactionId: ' + response.data.Transid,
                                status: response.data.Status,
                                createdBy: userid,
                                modifiedBy: userid
                            };
                            let addWalttet = await addNewWallet(newWallet1)
                        }
                        if (parseFloat(cashback) > 0) {
                            let newWallet1 = {
                                userid: userid,
                                credit: cashback,
                                transactionSource: devSource,
                                naration: 'For RechargeId: ' + response.data.RechargeID + ', and TransactionId: ' + response.data.Transid,
                                status: response.data.Status,
                                createdBy: userid,
                                modifiedBy: userid
                            };
                            let addWalttet = await addNewWallet(newWallet1)
                        }

                        const recharge = {
                            transactionId: response.data.Transid,
                            rechargeId: response.data.RechargeID,
                            userid: userid,
                            mobile: phone,
                            amount: amount,
                            operator: optcode,
                            status: response.data.Status,
                            createdBy: userid,
                            modifiedBy: userid,
                        }
                        const addRecharge = await addRechargeManager(recharge)

                        const userData = await getUserById(userid)

                        let walletBalance = userData.walletBalance;
                        let newWalletBalance = parseFloat(walletBalance) - parseFloat(amount) + parseFloat(cashback)


                        Users.findOneAndUpdate({ _id: new ObjectId(userid) }, {
                            walletBalance: newWalletBalance,
                        }, {
                            new: true
                        }).then((user) => {

                            console.log(newWalletBalance)
                            // res.status(200).send(user);
                            resolve(user)

                        });

                    }
                }).catch((error) => {
                    console.log(error)
                    throw error
                })
            })


        } else {
            throw new UpgradeRequiredError("Low Balance.")
        }
    } catch (error) {
        throw error
    }
}



module.exports = { getWalletData, getWalletDetail, getWalletDetail, getAllWallet, addNewTransaction, addNewWallet, updateWalletBalance, userWallet, razorpayRechargeTransactionManager, rechargeTransactionManager }