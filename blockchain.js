const Block = require("./block")
const cryptoHash = require('./cryptoHash')


class Blockchain {
    constructor() {
        this.chain = [Block.genesis()]

    }
    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        })
        this.chain.push(newBlock)

    }
    static isValideChain(chain){
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())){
            return false;
        } 
        for(let i=1; i<chain.length; i++){
            const {timestamp, lasthash, data} = chain[i];
            const actualLastHash = chain[i-1].hash;
          

            if(lasthash !== actualLastHash) return false;

            const validatedHash = cryptoHash(timestamp, lasthash, data);
            if(hash !== validatedHash) return false;
        }
        return true;
    }

}
module.exports = Blockchain;