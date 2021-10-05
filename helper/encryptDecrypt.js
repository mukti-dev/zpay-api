const bcrypt = require('bcrypt')

const encryptText = async (text) => {
    let encrypted
    let promise = new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) { reject(err) }
            bcrypt.hash(text, salt, (err, hash) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(hash)
                }
            });
        });
    })
    await promise.then((hash) => {
        encrypted = hash
    })
    return encrypted
}

const decryptText = async (text, hash) => {
    let decrypted;
    let promise = new Promise((resolve, reject) => {
        bcrypt.compare(text, hash, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        });
    })
    await promise.then(text => {
        decrypted = text
    })
    return decrypted
}

module.exports = { encryptText, decryptText }