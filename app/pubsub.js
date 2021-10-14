const radis = require('redis');
const blockchain = require('./blockchain')

const channels = {
    test: 'test',
    Blockchain: 'blockchain'
}

class Pubsub{
    constructor({blockchain}){
        this.blockchain = blockchain
        
        this.publisher = radis.createClient();
        this.subscribler = radis.createClient();
        

        // this.subscribler.subscribe(channels.test);
        // this.subscribler.subscribe(channels.Blockchain)
        this.subscribeToChannel();
        this.subscribler.on('message', (channel, message)=>{
            
            this.handleMessage(channel, message)
            
        })
       
    }
    handleMessage(channel, message){
        console.log(`massage racived chanall ${channel} massage ${message}`)
        const parsedMessage = JSON.parse(message)

        if(channel == channels.Blockchain){
            this.blockchain.replaceChain(parsedMessage)
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
}


module.exports = Pubsub;