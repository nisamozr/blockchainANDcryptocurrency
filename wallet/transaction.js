const {v4: uuid } = require('uuid')
const {verifySignature} = require('../util')

class Transaction{
    constructor({senderWallet, recipent, amount }){
        this.id = uuid()
        this.outputMap =   this.creatOutputMap({senderWallet, recipent, amount})
        // console.log(recipent)
        
        this.input = this.createInput({senderWallet, outputMap: this.outputMap})
    }
   
    creatOutputMap({senderWallet, recipent, amount}){
        let outputMap = {};
        this.recipent = recipent;
        

        outputMap[recipent] = amount
        // console.log(recipent)
       
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
    update({senderWallet, recipent, amount}){
        if (amount > this.outputMap[senderWallet.publicKey])
        {
            throw new Error('Amount excees balance')
        }
        if(!this.outputMap[recipent]){
            this.outputMap[recipent] = amount

        }else{
            this.outputMap[recipent] = this.outputMap[recipent] + amount
        }
       
        this.outputMap[senderWallet.publicKey] = this.outputMap[senderWallet.publicKey]- amount

        this.input = this.createInput({senderWallet, outputMap:this.outputMap})
    }
    static validTransation(transaction){
        const {input:{address, amount, signature}, outputMap} = transaction

        const outputTotal = Object.values(outputMap).reduce((total, outputAmount) =>
            total+outputAmount
        )
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

// console.log(Transaction.outputMap)
module.exports = Transaction;