const Block = require("./block");
const Blockchain = require("./blockchain")


describe('Blockchain()', () => {
    let blockchain , newChain;
    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();
        orginalChain = blockchain.chain;

    })

    it("contain a chain array instant", () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    })
    it('fist block genesis ', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    })
    it('add block', () => {
        const newdata = 'foo bar'
        blockchain.addBlock({ data: newdata })

        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newdata)
    })

    describe('isValideChain', () => {
        describe('when the chain does not start with the genesis block', () => {
            it('return false', () => {
                blockchain.chain[0] = { data: 'fake-geniseis' }
                expect(Blockchain.isValideChain(blockchain.chain)).toBe(false)

            })

        })
        describe('when the chain start with the genisis block and has multiple block', () => {
            beforeEach(() => {
                blockchain.addBlock({ data: 'bears' });
                blockchain.addBlock({ data: 'beets' });
                blockchain.addBlock({ data: 'baaaaaaaas' });
            })
            describe('lasthash reference has changed', () => {
                it('return false', () => {

                    blockchain.chain[2].lastHash = 'brokrn-lastHase';

                    expect(Blockchain.isValideChain(blockchain.chain)).toBe(false)

                })
            })
            describe('chain contain a invalid field', () => {
                it('returns false', () => {

                    blockchain.chain[2].data = 'someting ';

                    expect(Blockchain.isValideChain(blockchain.chain)).toBe(false)

                })
            })
            describe('chan cointain any invalid fiels', () => {
                it('return true', () => {

                    expect(Blockchain.isValideChain(blockchain.chain)).not.toBe(true);

                })
            })

        })

    })

    describe('replacement', ()=>{
        describe('when the new chain is not longer', ()=>{
            it('does not replace the chain', ()=>{
                newChain.chain[0] = {new : 'chain'};
                blockchain.replaceChain(newChain.chain);

                expect(blockchain.chain).toEqual(orginalChain);

            })
        })
    })

    describe('when the new chain is longer', ()=>{
        beforeEach(()=>{
            blockchain.addBlock({ data: 'bears' });
            blockchain.addBlock({ data: 'beets' });
            blockchain.addBlock({ data: 'baaaaaaaas' });
        })
        describe('the chain is invalid',()=>{

            it('does not replace the chain', ()=>{
                newChain.chain[2] = 'some- fake - hash';
                blockchain.replaceChain(newChain.chain);

                expect(blockchain.chain).toEqual(orginalChain);

            })
            

        })
        describe('the chain is valid', ()=>{
            it('replace the chain', ()=>{

            })

        })
    })


})