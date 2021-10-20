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
    createTransaction({amount, recipent, chain}){
        if(chain){
            this.balance = Wallet.calculateBalance({chain,address: this.publicKey})
        }
        if(amount > this.balance){
            throw new Error('Amount exceeds balance')
        }
        return new Transaction({senderWallet: this, recipent, amount})

    }
    static calculateBalance({chain, address}){
        let hasConductedTransaction = false
        let outputsTotal = 0; 
        for( let i=chain.length-1; i>0; i--){
            const block = chain[i];
            for(let transaction of block.data){
                if(transaction.input.address === address){
                    hasConductedTransaction = true
                }
                const addressOutput =  transaction.outputMap[address];

                if(addressOutput){
                    outputsTotal = outputsTotal+ addressOutput
                }
            }
            if(hasConductedTransaction){
                break;
            }
        }
        return hasConductedTransaction ? outputsTotal : startingBalance + outputsTotal

    }

}

module.exports = Wallet;