const Block = require("./block")
const Transaction = require('../wallet/transaction')
const cryptoHash = require('../util/cryptoHash')
const { reward_input, minerRate } = require("../config")

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()]

    }
    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        })
        this.chain.push(newBlock)

    }
    replaceChain(chain, onSuccess){
        if(chain.length <= this.chain.length){
            // console.error('The incoming chain must be longer')
            return
        }
        if(!Blockchain.isValidChain(chain)){
            // console.error('The incoming chain must be valid')
            return
        }
       if (onSuccess) onSuccess()
        // console.log('chain replact with ' ,chain)
        this.chain = chain;
    }

    // validTransactionData({chain}){
    //     for(let i=1;i<chain.length; i++){
    //         const block = chain[i]
    //         let rewardTransactionCount = 0
           
    //         for(let transaction of block.data){
    //             // console.log(transaction)
          
    //             if(transaction.input.address === reward_input.address){
    //                 rewardTransactionCount += 1
    //                 if(rewardTransactionCount > 1){
    //                     console.error('Miner rewards exceed limit');
    //                     return false
    //                 }

    //                 if(Object.values(transaction.outputMap)[0] !== minerRate){
    //                     console.error('Miner reward amount is invalid')
    //                     return false

    //                 }

    //             }
    //             else{
    //                 if(!Transaction.validTransation(transaction)){
    //                     console.error('invalide transaction')
    //                     return false
    //                 }
    //             }
    //         }
    //     }
    //    return true;
    // }


     static isValidChain(chain){
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())){
            return false;
        } 
        for(let i=1; i<chain.length; i++){
            const {timestamp, lastHash,hash, data, nonce, difficulty } = chain[i];
            const actualLastHash = chain[i-1].hash;
            const lastDifficulty = chain[i-1].difficulty;
          

            if(lastHash !== actualLastHash) return false;

            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
            if(hash !== validatedHash) return false;

            if((lastDifficulty - difficulty) > 1) return false
        }
        return true;
    }

}
module.exports = Blockchain;