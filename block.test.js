const hexToBinary = require('hex-to-binary')
const Block = require("./block");
const { GenesisData, minerRate } = require("./config");
const cryptoHash = require("./cryptoHash");
describe('Block',()=>{
    const timestamp = 2000;
    const lastHash = "dfjjgj";
    const hash = "dgjfg";
    const data = ['blooff', 'sdudufd'];
    const nonce = 1;
    const difficulty = 1;
    const block = new Block({ timestamp, lastHash, hash, data, nonce, difficulty });

    it('block as a timestrap lasthash hash data', ()=>{
        expect(block.timestamp).toEqual(timestamp)
        expect(block.lastHash).toEqual(lastHash)
        expect(block.hash).toEqual(hash)
        expect(block.data).toEqual(data)
        expect(block.difficulty).toEqual(difficulty)
        expect(block.nonce).toEqual(nonce)
       
        
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
            expect(mineBlock.hash).toEqual(cryptoHash(mineBlock.timestamp, mineBlock.nonce, mineBlock.difficulty, lastBlock.hash, data))
        })
        it('set a hash that maches the difficulty criteria',()=>{
            expect(hexToBinary(mineBlock.hash).substring(0, mineBlock.difficulty)).toEqual('0'.repeat(mineBlock.difficulty))
        })
        it('adjusts the difficulty', ()=>{
            const possibleResult = [lastBlock.difficulty+1, lastBlock.difficulty-1]

            expect(possibleResult.includes(mineBlock.difficulty)).toBe(true)
        })
    })

    describe('adjustDifficuty()', ()=>{
        it('raise the difficulty for a quickly mined block', ()=>{
            expect(Block.adjustDfficalty({originalBlock : block, timestamp : block.timestamp  + minerRate - 100})).toEqual(block.difficulty + 1)

        })
        it('lower the difficulty for a slowly mined block', ()=>{
            expect(Block.adjustDfficalty({originalBlock : block, timestamp: block.timestamp + minerRate + 100})).toEqual(block.difficulty - 1)

        })
        it('has a lower limit of 1', ()=>{
            block.difficulty = -1;

            expect(Block.adjustDfficalty({originalBlock : block })).toEqual(1);
        })
    })



});

