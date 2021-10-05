const { Recharge } = require('../models/recharge.models')
const { ObjectId } = require('mongoose').Types
const getRechargeData = async (userId, reqBody) => {
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
        const rechargeData = await Recharge.find(query).exec()
        return rechargeData

    } catch (error) {
        throw error
    }

}

//By Vikas 
const getRechargePendingData = async (status, reqBody) => {
    try {
        let query
        if (reqBody.startDate && reqBody.endDate) {
            query = {
                $and: [{ status: status }, {
                    "createdAt": {
                        "$gte": reqBody.startDate,
                        "$lt": reqBody.endDate
                    }
                }]
            }
        } else {
            query = { status: status }
        }
        console.log(JSON.stringify(query))
        const rechargeData = await Recharge.find(query).exec()
        return rechargeData

    } catch (error) {
        throw error
    }

}

const gettodayRechargeData = async (createdAt, reqBody) => {
    try {
        let query
        query = {
            $and: [{
                "createdAt": {
                    "$gte": createdAt,
                    "$lt": createdAt
                }
            }]
        }

        console.log(JSON.stringify(query))
        const rechargeData = await Recharge.find(query).exec()
        return rechargeData

    } catch (error) {
        throw error
    }

}
const getRechargeDetail = async (rechargeId) => {
    try {
        return await Recharge.find({ _id: new ObjectId(rechargeId) }).exec()
    } catch (error) {
        throw error
    }
}


const getallRechargeData = async () => {
    try {
        return await Recharge.find({}).exec()
    } catch (error) {
        throw error
    }
}

const addRechargeManager = async (reqBody) => {
    try {
        const recharge = new Recharge(reqBody)
        let result = await recharge.save()
        return result
    } catch (error) {
        throw error
    }
}

module.exports = { getRechargeData, getRechargeDetail, getRechargePendingData, gettodayRechargeData, getallRechargeData, addRechargeManager }