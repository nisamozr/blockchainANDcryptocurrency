const { GenesisData } = require("./config");

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
}
module.exports = Block;