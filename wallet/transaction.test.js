const Wallet = require('./index');
const { verifySignature } = require('../util');
const Transaction = require('./transaction')

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
            it('return true', () => {
                expect(Transaction.validTransation(transaction)).toBe(true)
            })

        })
        describe('when the transaction is invalid ', () => {
            describe('when transaction outputmap ', () => {
                it('returns flase', () => {
                    transaction.outputMap[senderWallet.publicKey] = 99999;
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

})