const Transaction = require('../wallet/transaction')

class TransactionMiner{
    constructor({blockchain, transactionPool, wallet , pubSub}){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool
        this.wallet= wallet
        this.pubSub = pubSub

    }

    mineTransactions(){
        const validTransaction = this.transactionPool.validTransaction();


        validTransaction.push(
            Transaction.rewardTransaction({minerWallet: this.wallet})
        )
        
        this.blockchain.addBlock({data: validTransaction})
        this. pubSub.broadChain()

       

        /this.transactionPool.clear()
         
    }
}

module.exports = TransactionMiner;