class Block{
    constructor({timestamp, lastHash, hash, data}){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }
}
const block1 = new Block({lastHash:'foo-lastHash',timestamp:"01/12/1999",  hash:'foo-hash', data:'foo-data'});

console.log('block1', block1);