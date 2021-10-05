const { Wallet } = require('../models/wallet.models')
const { ObjectId } = require('mongoose').Types
const Transaction = require('../models/transaction.models')
const Users = require('../models/users.models')
const { Recharge } = require('../models/recharge.models')
const axios = require('axios')


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

const userWallet = async (reqBody) => {

    return new Promise(async (resolve, reject) => {
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

        //only promise implemented by Mukti . Old login implemented

        let wallet = await Wallet.aggregate([{ $match: { userid: new ObjectId(userid) } }, { $group: { _id: "$userid", creditsum: { $sum: "$credit" }, debitsum: { $sum: "$debit" } } }]).exec()
        console.log(wallet)
        let bal = wallet[0].creditsum - wallet[0].debitsum;

        if (bal >= amount) {
            let post_data = JSON.stringify({
                "Customernumber": phone,
                "Tokenid": tokenid,
                "Userid": userid1,
                "Amount": amount,
                "Optcode": optcode,
                "Yourrchid": "Your Recharge Unique Id",
            });
            console.log(post_data)

            let config = {
                method: 'post',
                url: 'https://www.zpay.co.in/Recharge/Recharge',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: post_data
            };

            axios(config).then((response) => {
                console.log(JSON.stringify(response.data));

                if (response.data.Status == 'Success') {
                    // if ('Success' == 'Success') {
                    console.log(response.data.Remain)

                    console.log("Vikas Saini")


                    let newWallet = new Wallet({
                        userid: userid,
                        debit: amount,
                        transactionSource: devSource,
                        naration: 'For RechargeId: ' + response.data.RechargeID + ', and TransactionId: ' + response.data.Transid,
                        status: response.data.Status,
                        createdBy: userid,
                        modifiedBy: userid
                    });
                    newWallet.save().then((walletDoc) => {


                        console.log('walletentry')

                        let newWallet1 = new Wallet({
                            userid: userid,
                            credit: cashback,
                            transactionSource: devSource,
                            naration: 'From Cashback, RechargeId: ' + response.data.RechargeID + ', and TransactionId: ' + response.data.Transid,
                            status: response.data.Status,
                            createdBy: userid,
                            modifiedBy: userid
                        });
                        newWallet1.save().then((walletDoc1) => {
                            console.log('rechargeentry')

                            let newRecharge = new Recharge({
                                transactionId: response.data.Transid,
                                rechargeId: response.data.RechargeID,
                                userid: userid,
                                mobile: phone,
                                amount: amount,
                                operator: optcode,
                                status: response.data.Status,
                                createdBy: userid,
                                modifiedBy: userid,
                            });
                            newRecharge.save().then((rechargeDoc) => {

                                console.log('user: ' + userid)
                                let userid_obj = new ObjectId(userid);

                                Users.find({
                                    _id: userid_obj,
                                }).then((users) => {

                                    let walletBalance = users[0].walletBalance;
                                    console.log(users[0].walletBalance)
                                    let newWalletBalance = parseFloat(walletBalance) - parseFloat(amount) + parseFloat(cashback)
                                    console.log(walletBalance)
                                    console.log('Check  Vikas')
                                    console.log(amount)
                                    console.log(cashback)


                                    Users.findOneAndUpdate({ _id: new ObjectId(userid_obj) }, {
                                        walletBalance: newWalletBalance,
                                        modifiedBy: new ObjectId(userid_obj),
                                    }, {
                                        new: true
                                    }).then((user) => {

                                        console.log(newWalletBalance)
                                        // res.status(200).send(user);
                                        resolve(user)

                                    });


                                }).catch((e) => {
                                    // res.status(400).send(e);
                                    reject(e)
                                });


                            }).catch((e) => {
                                // res.status(400).send(e);
                                reject(e)
                            });



                        }).catch((e) => {
                            // res.status(400).send(e);
                            reject(e)
                        });



                    }).catch((e) => {
                        // res.status(400).send(e);
                        reject(e)
                    });



                }
                else {
                    console.log(response.data.Yourrchid)
                    console.log("superman")

                    let newRecharge = new Recharge({
                        transactionId: 'test',
                        userid: userid,
                        mobile: phone,
                        amount: amount,
                        operator: optcode,
                        status: response.data.Status,
                        createdBy: userid,
                        modifiedBy: userid,
                    });
                    newRecharge.save().then((rechargeDoc) => {
                        // res.send(rechargeDoc)
                        resolve(rechargeDoc)
                    })


                }
            })
        }
    })
}


const razorpayRechargeTransactionManager = async (reqBody) => {
    return new Promise((resolve, reject) => {

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

        Wallet.aggregate([{ $match: { userid: userid } }, { $group: { _id: "$userid", creditsum: { $sum: "$credit" }, debitsum: { $sum: "$debit" } } }])
            .then((wallet) => {
                let bal = wallet[0].creditsum - wallet[0].debitsum;

                // if(bal >= amount){

                let post_data = JSON.stringify({
                    "Customernumber": phone,
                    "Tokenid": tokenid,
                    "Userid": userid1,
                    "Amount": amount,
                    "Optcode": optcode,
                    "Yourrchid": "Your Recharge Unique Id",
                });
                console.log(post_data)

                let config = {
                    method: 'post',
                    url: 'https://www.zpay.co.in/Recharge/Recharge',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: post_data
                };

                axios(config)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));

                        // if(response.data.Status == 'Success'){
                        if ('Success' == 'Success') {
                            console.log(response.data.Remain)

                            console.log("Vikas Saini")

                            let newTransaction = new Transaction({
                                userId: userid,
                                amount: amount,
                                transactionid: transactionid,
                                status: response.data.Status,
                                createdBy: userid,
                                modifiedBy: userid,
                            });
                            newTransaction.save().then((newTransactionDoc) => {
                                // the full user document is returned (incl. id)
                                let newWallet2 = new Wallet({
                                    userid: userid,
                                    credit: amount,
                                    status: response.data.Status,
                                    transactionid: newTransactionDoc._id,
                                    transactionSource: devSource,
                                    naration: 'Recharge Amount :' + amount + ', TransactionId: ' + newTransactionDoc._id,
                                    createdBy: userid,
                                    modifiedBy: userid
                                });
                                newWallet2.save().then((walletDoc) => {

                                    let newWallet = new Wallet({
                                        userid: userid,
                                        debit: amount,
                                        transactionSource: devSource,
                                        naration: 'For RechargeId: ' + response.data.RechargeID + ', and TransactionId: ' + response.data.Transid,
                                        status: response.data.Status,
                                        createdBy: userid,
                                        modifiedBy: userid
                                    });
                                    newWallet.save().then((walletDoc) => {
                                        let newWallet1 = new Wallet({
                                            userid: userid,
                                            credit: cashback,
                                            transactionSource: devSource,
                                            naration: 'From Cashback, RechargeId: ' + response.data.RechargeID + ', and TransactionId: ' + response.data.Transid,
                                            status: response.data.Status,
                                            createdBy: userid,
                                            modifiedBy: userid
                                        });
                                        newWallet1.save().then((walletDoc1) => {
                                            let newRecharge = new Recharge({
                                                transactionId: response.data.Transid,
                                                rechargeId: response.data.RechargeID,
                                                userid: userid,
                                                mobile: phone,
                                                amount: amount,
                                                operator: optcode,
                                                status: response.data.Status,
                                                createdBy: userid,
                                                modifiedBy: userid,
                                            });
                                            newRecharge.save().then((rechargeDoc) => {
                                                let userid_obj = new ObjectId(userid);

                                                Users.find({
                                                    _id: userid_obj,
                                                }).then((users) => {

                                                    let walletBalance = users[0].walletBalance;
                                                    let newWalletBalance = parseFloat(walletBalance) + parseFloat(cashback)

                                                    Users.findOneAndUpdate({ _id: userid_obj }, {
                                                        walletBalance: newWalletBalance
                                                    }, {
                                                        new: true
                                                    }).then((user) => {

                                                        // res.status(200).send(user);
                                                        resolve(user)

                                                    });

                                                }).catch((e) => {
                                                    // res.status(400).send(e);
                                                    reject(e)
                                                });

                                            }).catch((e) => {
                                                // res.status(400).send(e);
                                                reject(e)
                                            });

                                        }).catch((e) => {
                                            // res.status(400).send(e);
                                            reject(e)
                                        });



                                    }).catch((e) => {
                                        // res.status(400).send(e);
                                        reject(e)
                                    });

                                }).catch((e) => {
                                    // res.status(400).send(e);
                                    reject(e)
                                });

                            }).catch((e) => {
                                // res.status(400).send(e);
                                reject(e)
                            });



                        }
                        else if (response.data.Status == 'Failed') {
                            console.log(response.data.Yourrchid)
                            console.log("superman")
                            res.send("naruto")
                        }

                    })
                    .catch(function (error) {
                        console.log(error);
                    });

                // }else{

                //     res.send("wallet balance is not sufficient")
                // }
                // res.send(wallet);
            }).catch((e) => {

                console.log("Catch Error")
                res.status(400).send(e);
            });

        resolve(true)
    })
}

module.exports = { getWalletData, getWalletDetail, getWalletDetail, getAllWallet, addNewTransaction, addNewWallet, updateWalletBalance, userWallet, razorpayRechargeTransactionManager }