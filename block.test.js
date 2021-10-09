const Block = require("./block");
const { GenesisData } = require("./config");
const cryptoHash = require("./cryptoHash");
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
    describe('mineBlock()', ()=>{
        const lastBlock = Block.genesis();
        const data = 'mind data';
        const mineBlock = Block.mineBlock({lastBlock, data});
        it('return a blocks instance', ()=>{
            expect(mineBlock instanceof Block).toBe(true);
        });
        it('sets the `last Hash` to be the `hash` of the lastBlock', ()=>{
            expect(mineBlock.lastHash).toEqual(lastBlock.hash);
        });
        it('sets the data', ()=>{
            expect(mineBlock.data).toEqual(data);
        });
        it('sets a timestrap' , ()=>{
            expect(mineBlock.timestamp).not.toEqual(undefined);
        });
        it('creat sha 256 has based on proper input,' ,()=>{
            expect(mineBlock.hash).toEqual(cryptoHash(mineBlock.timestamp, lastBlock.hash, data))
        })
    })



});

