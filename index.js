const express = require('express');
const bodyParser = require('body-parser')
const request = require('request')

const Blockchain = require('./blockchain/blockchain');
const PubSub = require('./app/pubsub')
const TransactionPool = require('./wallet/transactioinPoot')
const Wallet = require('./wallet/index')

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool()
const pubsub = new PubSub({blockchain, transactionPool})
const wallet = new Wallet()

const Defalt_Port = 3000;
const rootNodeAddress = `http://localhost:${Defalt_Port}`;
// setTimeout(()=> pubsub.broadcastChain(),1000);

app.use(bodyParser.json());

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
            transaction = wallet.createTransaction({recipent, amount});
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

const syncChains = ()=>{
    request({url: `${rootNodeAddress}/api/blocks`},(error, res, body)=>{
        if(!error && res.statusCode === 200){
            const rootChain = JSON.parse(body)

            console.log('replace on a synce withw', rootChain)

            blockchain.replaceChain(rootChain)
        

        }
    })
}

let peerPort ;

if(process.env.GENERTE_PEER_PORT === 'true'){
    peerPort = Defalt_Port+ Math.ceil(Math.random()*1000)
}
const PORT = peerPort || Defalt_Port;
app.listen(PORT, ()=>{
    console.log(`listing at localhost:${PORT}`)
    if(PORT !== Defalt_Port){
        syncChains();
    }

})