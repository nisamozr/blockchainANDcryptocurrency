const {startingBalance} = require('../config')
const {ec} = require('../util')
const cryptoHash = require('../util/cryptoHash');
const Transaction = require('./transaction');

class Wallet{
    constructor(){
        this.balance = startingBalance;

        this.keyPair = ec.genKeyPair();
         this.publicKey = this.keyPair.getPublic().encode('hex')
    }
    sign(data){
        return this.keyPair.sign(cryptoHash(data))

    }
    createTransaction({amount, recipent}){
        if(amount > this.balance){
            throw new Error('Amount exceeds balance')
        }
        return new Transaction({senderWallet: this, recipent, amount})

    }

}

module.exports = Wallet;