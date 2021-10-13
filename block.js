const hexToBinary = require('hex-to-binary')
const { GenesisData, minerRate } = require("./config");
const cryptoHash = require("./cryptoHash");


class Block{
    constructor({timestamp, lastHash, hash, data, nonce , difficulty }){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }
    static genesis(){
        return new this(GenesisData);
    }
    static mineBlock({lastBlock, data}){
       
        // const timestamp =  Date.now();
        const lastHash = lastBlock.hash;
        let hash, timestamp;
        let {difficulty} = lastBlock;
        let nonce = 0;
        do{
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDfficalty({originalBlock: lastBlock, timestamp})
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty)
        }while(hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty))
        return new this({
            timestamp,
            lastHash,
            data,
            difficulty,
            nonce,
            hash 
        })

      
    }
    static adjustDfficalty({originalBlock, timestamp}){
        const {difficulty} = originalBlock;

        const difference = timestamp - originalBlock.timestamp;
        if(difficulty <1) return 1;

        if(difference > minerRate) return difficulty - 1;

        return difficulty + 1 ;
        
            
    }
}
module.exports = Block;