const express = require('express');
const bodyParser = require('body-parser')
const request = require('request')

const Blockchain = require('./blockchain');
const PubSub = require('./pubsub')

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({blockchain})
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