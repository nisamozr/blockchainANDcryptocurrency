const {v4: uuid } = require('uuid')
const {verifySignature} =require('../util')

class Transaction{
    constructor({senderWallet, recipent, amount}){
        this.id = uuid()
        this.outputMap = this.creatOutputMap({senderWallet,recipent,amount})
        this.input = this.createInput({senderWallet, outputMap: this.outputMap})
    }

    creatOutputMap({senderWallet, recipent, amount}){
        const outputMap = {};

        outputMap[recipent] = amount;
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;
        return outputMap;
    }
    createInput({senderWallet, outputMap}){
        return {
            timestamp : Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(outputMap)
        }
    }
    static validTransation(transaction){
        const {input:{address, amount, signature}, outputMap} = transaction

        const outputTotal = Object.values(outputMap).reduce((total, outputAmount) =>{
            total+outputAmount;
        })
        if(amount !== outputTotal){
            console.error('invalidwe transation')
            return false
        }
        if(!verifySignature({publicKey: address, data: outputMap,signature})){
            console.error("invalide signatry ")
            return false
        }

        return true;  

    }
}

module.exports = Transaction;