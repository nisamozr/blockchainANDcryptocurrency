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
    static calculateBalance({chain, address}){
        let outputsTotal = 0; 
        for( let i=1; i<chain.length; i++){
            const block = chain[i];
            for(let transaction of block.data){
                const addressOutput =  transaction.outputMap[address];

                if(addressOutput){
                    outputsTotal = outputsTotal+ addressOutput
                }
            }
        }
        return startingBalance + outputsTotal

    }

}

module.exports = Wallet;