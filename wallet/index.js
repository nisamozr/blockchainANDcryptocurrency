const {startingBalance} = require('../config')
const {ec} = require('../util')
const cryptoHash = require('../util/cryptoHash')

class Wallet{
    constructor(){
        this.balance = startingBalance;

        this.keyPair = ec.genKeyPair();
         this.publicKey = this.keyPair.getPublic().encode('hex')
    }
    sign(data){
        return this.keyPair.sign(cryptoHash(data))

    }

}

module.exports = Wallet;