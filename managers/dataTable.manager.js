const Operator = require('../models/operator.model')
const { ObjectId } = require('mongoose').Types

const findOperatorRecords = async (searchValue, filter, reason) => {
    let query
    if (!searchValue || searchValue !== null || searchValue.trim() !== "" || searchValue !== undefined) {
        let searchKey = new RegExp(searchValue, 'i')
        query = {
            $or: [
                { name: { $regex: searchKey } },
                { operatorCode: { $regex: searchKey } },
                { cashbackPercentageForZpay: { $regex: searchKey } },
                { cashbackPercentageForCustomer: { $regex: searchKey } }
            ]
        }
    } else {
        query = {}
    }

    let result

    if (reason == 'count') {
        result = await Operator.count(query)
    }
    if (reason == 'records') {
        let sorting = {}
        sorting[filter.document] = filter.sort
        console.log(sorting)
        console.log(filter)
        result = await (await Operator.find(query).limit(filter.limit).skip(filter.skip).sort(sorting))
    }
    return result
}


module.exports = { findOperatorRecords }
