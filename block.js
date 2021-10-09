const { GenesisData } = require("./config");
const cryptoHash = require("./cryptoHash");

class Block{
    constructor({timestamp, lastHash, hash, data}){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }
    static genesis(){
        return new this(GenesisData);
    }
    static mineBlock({lastBlock, data}){
        const timestamp =  Date.now();
        const lastHash = lastBlock.hash;
        return new this({
            timestamp,
            lastHash,
            data,
            hash: cryptoHash(timestamp, lastHash, data)
        })

    }
}
module.exports = Block;