class TransactionMiner{
    constructor({blockchain, transactionPool, wallet , pubSub}){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool
        this.wallet= wallet
        this.pubSub = pubSub

    }

    mineTransactions(){
        //get the transaction pool valid transactiom

        //generate the miner reward 

        //add a block consisting of these transaction to the blockchain

        //broadcast the update blockchain

        //clear the pool
         
    }
}

module.exports = TransactionMiner;