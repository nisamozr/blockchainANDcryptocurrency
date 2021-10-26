var express = require('express');
var router = express.Router();
const path = require('path')

const Blockchain = require('../blockchain/blockchain');
const PubSub = require('../app/pubsub')
const TransactionPool = require('../wallet/transactioinPoot')
const Wallet = require('../wallet/index')
const TransactionMiner = require('../app/transactionMinert')

const blockchain = new Blockchain();
const transactionPool = new TransactionPool()
const pubsub = new PubSub({blockchain, transactionPool})
const wallet = new Wallet()

const transactionMiner = new TransactionMiner({blockchain, transactionPool, wallet, pubsub})   


router.get('/api/blocks', (req, res)=>{
    res.json(blockchain.chain)
})
router.post('/api/mine', (req, res)=>{
    const {data} = req.body;
    blockchain.addBlock({data});
    pubsub.broadcastChain()

    res.redirect('/api/blocks');
})
router.post('/api/transact', (req, res)=>{
    const {amount , recipent} = req.body
    let transaction = transactionPool.existingTransaction({inputAddress: wallet.publicKey})
    try{
        if(transaction){
            transaction.update({senderWallet: wallet, recipent, amount})
        }else{
            transaction = wallet.createTransaction({recipent, amount, chain: blockchain.chain});
        }
       

    }catch(error){
        return res.status(400).json({type: 'error', message: error.message})

    }

 
    transactionPool.setTransaction(transaction)
    pubsub.broadcastTransaction(transaction)
    // console.log('transactionPool', transactionPool)

    res.json({type:"success", transaction})
})
router.get('/api/transaction-pool-map', (req, res)=> {
    res.json(transactionPool.transactionMap)
})
router.get('/api/minr-tansactions',(req , res)=>{
    transactionMiner.mineTransactions()
    res.redirect('/api/blocks')
})

router.get('/api/wallet-info',(req, res)=>{
   
    res.json({address: wallet.publicKey, balance : Wallet.calculateBalance({chain: blockchain.chain, address: wallet.publicKey})})
})
router.get('api/known-addresses', (req, res)=>{
    const addressMap = {}
    for( let block of blockchain.chain){
    for( let transaction of block.data){
        const recipent = Object.keys(transaction.outputMap)
        recipent.forEach(recipent => addressMap[recipent] = recipent)
    }
}
res.json(Object.keys(addressMap))

})
router.get('*', (req, res)=> {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
})

module.exports = router;
