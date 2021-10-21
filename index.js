const express = require('express');
const bodyParser = require('body-parser')
const request = require('request')
const path = require('path')

const Blockchain = require('./blockchain/blockchain');
const PubSub = require('./app/pubsub')
const TransactionPool = require('./wallet/transactioinPoot')
const Wallet = require('./wallet/index')
const TransactionMiner = require('./app/transactionMinert')

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool()
const pubsub = new PubSub({blockchain, transactionPool})
const wallet = new Wallet()
const transactionMiner = new TransactionMiner({blockchain, transactionPool, wallet, pubsub})

const Defalt_Port = 5000;
const rootNodeAddress = `http://localhost:${Defalt_Port}`;
// setTimeout(()=> pubsub.broadcastChain(),1000);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'client/dist')))

app.get('/api/blocks', (req, res)=>{
    res.json(blockchain.chain)
})
app.post('/api/mine', (req, res)=>{
    const {data} = req.body;
    blockchain.addBlock({data});
    pubsub.broadcastChain()

    res.redirect('/api/blocks');
})
app.post('/api/transact', (req, res)=>{
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
app.get('/api/transaction-pool-map', (req, res)=> {
    res.json(transactionPool.transactionMap)
})
app.get('/api/minr-tansactions',(req , res)=>{
    transactionMiner.mineTransactions()
    res.redirect('/api/blocks')
})

app.get('/api/wallet-info',(req, res)=>{
   
    res.json({address: wallet.publicKey, balance : Wallet.calculateBalance({chain: blockchain.chain, address: wallet.publicKey})})
})
app.get('*', (req, res)=> {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'))
})

const syncWithRootStat = ()=>{
    request({url: `${rootNodeAddress}/api/blocks`},(error, res, body)=>{
        if(!error && res.statusCode === 200){
            const rootChain = JSON.parse(body)

            console.log('replace on a synce withw', rootChain)

            blockchain.replaceChain(rootChain)
        

        }
    })
    request({url: `${rootNodeAddress}/api/transaction-pool-map`}, (error, res, body)=>{
        if(!error && res.statusCode === 200){
            const rootTransactionPoolMap = JSON.parse(body)

            console.log('replace transaction pool map on a sync with', rootTransactionPoolMap)
            transactionPool.setMap(rootTransactionPoolMap)
        }

    })
}

const walletFoo = new Wallet()
const walletBar = new Wallet()

const grneratWalletTransaction = ({ wallet, recipent, amount}) =>{
    const transaction = wallet.createTransaction({
        recipent, amount, chain:blockchain.chain
    })

    transactionPool.setTransaction(transaction)
}

const walletAction = ()=> grneratWalletTransaction({wallet, recipent:walletFoo.publicKey, amount:5})

const walletFooAction = ()=> grneratWalletTransaction({wallet: walletFoo, recipent:walletBar.publicKey, amount:10})
const walletBarAction = ()=> grneratWalletTransaction({wallet: walletBar, recipent:wallet.publicKey, amount:15})

for(let i= 0 ; i<10; i++){
    if(i%3 ===0){
        walletAction()
        walletFooAction
    }
    else if(i%3 ===1){
        walletAction()
        walletBarAction()
    }else{
        walletFooAction()
        walletBarAction()
    }

    transactionMiner.mineTransactions();
}

let peerPort ;

if(process.env.GENERTE_PEER_PORT === 'true'){
    peerPort = Defalt_Port+ Math.ceil(Math.random()*1000)
}
const PORT = peerPort || Defalt_Port;
app.listen(PORT, ()=>{
    console.log(`listing at localhost:${PORT}`)
    if(PORT !== Defalt_Port){
        syncWithRootStat();
    }

})