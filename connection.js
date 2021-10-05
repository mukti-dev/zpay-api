const mongoose = require('mongoose')
const mongoConfig = require('./config/mongoConfig.json')

const connect = () => {
    mongoose.connect(mongoConfig.connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    mongoose.connection.on('connected', function () { console.log('connected to mongodb') });
    mongoose.connection.on('error', (err) => {
        console.log('Error:', err)
    });
}
module.exports = { connect }