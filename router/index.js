var express = require('express');
var router = express.Router();
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
router.get('*', (req, res)=> {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'))
})
