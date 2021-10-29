const radis = require('redis');
// const blockchain = require('../blockchain/blockchain')

const channels = {
    test: 'test',
    Blockchain: 'Blockchain',
    Transaction: 'Transaction'
}

class Pubsub{
    constructor({blockchain, transactionPool, redisUrl}){
        this.blockchain = blockchain
        this.transactionPool = transactionPool
        
        this.publisher = radis.createClient(redisUrl);
        this.subscribler = radis.createClient(redisUrl);
        

        // this.subscribler.subscribe(channels.test);
        // this.subscribler.subscribe(channels.Blockchain)
        this.subscribeToChannel();
        this.subscribler.on('message', (channel, message)=>{
            
            this.handleMessage(channel, message)
            
        })
       
    }
    handleMessage(channel, message){
        // console.log(`massage racived chanall ${channel} massage ${message}`)
        const parsedMessage = JSON.parse(message)

        switch(channel){
            case channels.Blockchain : this.blockchain.replaceChain(parsedMessage, ()=>{
                this.transactionPool.createBlockchainTransaction({
                    chain: parsedMessage
                })
            })
            break;
            case channels.Transaction : this.transactionPool.setTransaction(parsedMessage)
            break;
            default: return;
        }
    }
    subscribeToChannel(){
        Object.values(channels).forEach(channel =>{
            this.subscribler.subscribe(channel)
        })
    }
    publish({channel, message}){
        this.subscribler.unsubscribe(channel, ()=>{
            this.publisher.publish(channel, message, ()=>{
                this.subscribler.subscribe(channel)
            })
        })
        
    }
    broadcastChain(){
        this.publish({channel: channels.Blockchain, message: JSON.stringify(this.blockchain.chain)})
    }
    broadcastTransaction(transaction){
        this.publish({
            channel: channels.Transaction,
            message: JSON.stringify(transaction)
        })
     }
}
 

module.exports = Pubsub;