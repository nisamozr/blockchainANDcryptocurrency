const Transaction = require('./transaction')
const Wallet = require('./index');
const { verifySignature } = require('../util');
const { reward_input, miningReward } = require('../config');
const TransactionPool = require('./transactioinPoot');


describe('Transaction ', () => {
    let transaction, senderWallet, recipent, amount;

    beforeEach(() => {
        senderWallet = new Wallet();
        recipent = 'recipent-public-key';
        amount = 50;

        transaction = new Transaction({ senderWallet, recipent, amount })
    })

    it('has an id', () => {
        expect(transaction).toHaveProperty('id');
    })

    describe('outputMap', () => {
        it('has an outputMap', () => {
            expect(transaction.outputMap[recipent]).toEqual(amount)
        })

    })

    describe('input', () => {
        it('has an input ', () => {
            expect(transaction).toHaveProperty('input')

        })
        it('has a timestamp in the input', () => {
            expect(transaction.input).toHaveProperty('timestamp')

        })
        it('set the amount to thesenderWallet balance', () => {
            expect(transaction.input.amount).toEqual(senderWallet.balance);

        })
        it('set the addres to the sender wallet publickey', () => {
            expect(transaction.input.address).toEqual(senderWallet.publicKey)

        })
        it('signs the input', () => {
            expect(verifySignature({ publicKey: senderWallet.publicKey, data: transaction.outputMap, signature: transaction.input.signature })).toBe(true)
        })

    })
    describe('validTransaction()', () => {
        let errorMck;

        beforeEach(() => {
            errorMck = jest.fn()
            global.console.error = errorMck

        })
        describe('when the transaction is valid', () => {
            it('returns true', ()=> {
                expect(Transaction.validTransation(transaction)).toBe(true)
            })
        })
        describe('when the transaction is invalid ', () => {
            describe('when transaction outputmap ', () => {
                it('returns flase', () => {
                    transaction.outputMap[senderWallet.publicKey] = 999999;
                    expect(Transaction.validTransation(transaction)).toBe(false)
                    expect(errorMck).toHaveBeenCalled()
                })
            })
            describe('when the transaction input signature is invalid ', () => {
                it('returns flase', () => {
                    transaction.input.signature = new Wallet().sign('data')
                    expect(Transaction.validTransation(transaction)).toBe(false)
                    expect(errorMck).toHaveBeenCalled()
                })
            })
        })
    })
    describe('update', ()=>{
        let originalSingnature, orginalSenderOutput, nextRecipient, nextAmount;

        describe('and the amount is invalid', ()=>{
            it('throw an error', ()=>{
                expect(()=>{transaction.update({senderWallet, recipent: 'foo', amount: 999999})}).toThrow('Amount excees balance')
            })
        })

        describe('and the amount is valid', ()=>{
            beforeEach(()=>{
                originalSingnature = transaction.input.signature;
                orginalSenderOutput = transaction.outputMap[senderWallet.publicKey]
                nextRecipient = 'netx-resipent'
                nextAmount = 50
    
                transaction.update({senderWallet, recipent:nextRecipient, amount:nextAmount})
            })
            it('outpus the amount to the next resipient', ()=>{
                expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount)
    
            })
            it('substracts the amound from the original sender output amount', ()=>{
                expect(transaction.outputMap[senderWallet.publicKey]).toEqual(orginalSenderOutput-nextAmount)
                
            })
            it('maintains a total output that matches the input amount', ()=>{
                expect(Object.values(transaction.outputMap).reduce((total, outputAmount) => total+ outputAmount)).toEqual(transaction.input.amount)
                
            })
            it('re-signs the transaction', ()=>{
                expect(transaction.input.signature).not.toEqual(originalSingnature)
                
            })

            describe('and another update for the same resipient', () =>{
                let addAmount;

                beforeEach(() =>{
                    addAmount =80
                    transaction.update({senderWallet, recipent: nextRecipient, amount: addAmount})
                })

                it('add to the recipient amount',  ()=>{
                    expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount + addAmount)
                })
                it('substract the amount from  the originalSenter output amount',  ()=>{
                    expect(transaction.outputMap[senderWallet.publicKey]).toEqual(orginalSenderOutput-nextAmount -addAmount)
                })
            })

        })

      
    })

    describe('rewardTransaction()', ()=>{
        let rewardTransaction, minerWallet

        beforeEach(()=>{
            minerWallet = new Wallet();
            rewardTransaction =Transaction.rewardTransaction({minerWallet})
        })

        it('creates a transaction with the reward input', ()=>{
            expect(rewardTransaction.input).toEqual(reward_input)
        })
        it('creates one transaction for the miner with the miningReward', ()=>{
            expect(rewardTransaction.outputMap[minerWallet.publicKey]).toEqual(miningReward)
        })
    })
 

})