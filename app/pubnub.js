const PubNub = require('pubnub')

const credencials = {
    publishKey: 'pub-c-5f684895-f0f8-4dcf-9f5c-0dda3a31f9c9',
    subscribeKey: 'sub-c-66a55f0a-2c11-11ec-bfec-fa2d187f6aa6',
    secretKey: 'sec-c-MThiOWY5YTUtYzE2Mi00ZWRhLThjYjUtNzNkZWNkMTQ3MTM1'

}
const CHANNELS = {
    test: 'test',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
}

class Pubsub {
    constructor({ blockchain, transactionPool, wallet }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        console.log('fffffffffffffffffffffffff')

        this.pubnub = new PubNub(credencials)
        this.pubnub.subscribe({ CHANNELS: Object.values(CHANNELS) })
        this.pubnub.addListener(this.listener())
    }
    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    }
    subscribeToChannels() {
        this.pubnub.subscribe({
            channels: [Object.values(CHANNELS)]
        });
    }

    listener() {
        return {
            message: messageObect => {
                const { channel, message } = messageObect
                

                console.log(`Message recived. channel:${channel}.massage: ${message}`)
                const parsedMessage = JSON.parse(message);

                switch (channel) {
                    case CHANNELS.BLOCKCHAIN:
                        this.blockchain.replaceChain(parsedMessage, true, () => {
                            this.transactionPool.createBlockchainTransaction(
                                { chain: parsedMessage.chain }
                            );
                        });
                        break;
                    case CHANNELS.TRANSACTION:
                        if (!this.transactionPool.existingTransaction({
                            inputAddress: this.wallet.publicKey
                        })) {
                            this.transactionPool.setTransaction(parsedMessage);
                        }
                        break;
                    default:
                        return;
                }
            }
        }
    }
    publish({ channel, message }) {
        this.pubnub.publish({  message, channel })
    }
    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    }

}

module.exports = Pubsub