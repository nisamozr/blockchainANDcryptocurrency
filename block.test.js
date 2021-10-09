const Block = require("./block");
const { GenesisData } = require("./config");
describe('Block',()=>{
    const timestamp = "a-ads";
    const lastHash = "dfjjgj";
    const hash = "dgjfg";
    const data = ['blooff', 'sdudufd'];
    const block = new Block({ timestamp, lastHash, hash, data,});

    it('block as a timestrap lasthash hash data', ()=>{
        expect(block.timestamp).toEqual(timestamp)
        expect(block.lastHash).toEqual(lastHash)
        expect(block.hash).toEqual(hash)
        expect(block.data).toEqual(data)
    });

    describe('Genesis()',()=>{
        const genesisBlock = Block.genesis();
        console.log(genesisBlock);
        it('return a blocks instance', ()=>{
            expect(genesisBlock instanceof Block).toBe(true);
        });
        it('retur a genesis data', ()=>{
            expect(genesisBlock).toEqual(GenesisData);
        })

    });



});

