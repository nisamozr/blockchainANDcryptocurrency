const crypto = require('crypto')
// const hexToBinary = require('hex-to-binary')

const cryptoHash = (...input)=>{
    const hash = crypto.createHash('sha256');

    hash.update(input.map( input => JSON.stringify(input)).sort().join(' '));
   return hash.digest('hex');

}

module.exports = cryptoHash;