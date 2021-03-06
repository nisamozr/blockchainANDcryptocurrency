const Wallet = require('./index')
const { verifySignature } = require('../util');
const Transaction = require('./transaction');
const Blockchain = require('../blockchain/blockchain');

const { startingBalance } = require('../config')

describe('wallet', () => {
    let wallet;
    beforeEach(() => {
        wallet = new Wallet();
    })

    it('has a balance', () => {
        expect(wallet).toHaveProperty('balance');
    })
    it('has a publick key', () => {
        // console.log(wallet.publicKey)
        expect(wallet).toHaveProperty('publicKey');
    })

    describe('siging data', () => {
        const data = 'foobar'

        it('verify a signature', () => {
            expect(verifySignature({
                publicKey: wallet.publicKey,
                data,
                signature: wallet.sign(data)
            })).toBe(true)

        })
        it('does not verify an invalid signature', () => {
            expect(verifySignature({
                publicKey: wallet.publicKey,
                data,
                signature: new Wallet().sign(data)
            })).toBe(false)

        })

    })
    describe('creatTransaction()', () => {
        describe('and the amount exceed the balance', () => {
            it('throws an error', () => {
                expect(() => wallet.createTransaction({ amount: 999999, recipent: 'foo-recipient' })).toThrow('Amount exceeds balance');
            })

        })

        describe('the amount is valid', () => {
            let transaction, amount, recipent;

            beforeEach(() => {
                amount = 50;
                recipent = "foo-recipient"
                transaction = wallet.createTransaction({ amount, recipent })
            })

            it('create an intance of transaction', () => {
                expect(transaction instanceof Transaction).toBe(true)

            })
            it('matches the transaction input with the wallet', () => {
                expect(transaction.input.address).toEqual(wallet.publicKey)

            })
            it('outupt the amount the recipient', () => {
                expect(transaction.outputMap[recipent]).toEqual(amount)

            })

        })

        describe('and a chain is passed', ()=>{
            it('call walllet.calucalater',()=>{
                const calculateBalanceMock = jest.fn()
                const orginalCalculateBalance = Wallet.calculateBalance

                wallet.calculateBalance = calculateBalanceMock;
                wallet.calculateBalance({recipent: 'foo', amount:10, chain: new Blockchain().chain
            })

            expect(calculateBalanceMock).toHaveBeenCalled()
            wallet.calculateBalance = orginalCalculateBalance
            })
        })
    })
    describe('calculateBalance()', () => {
        let blockchain

        beforeEach(() => {
            blockchain = new Blockchain();
        })

        describe('and there are no outputs for the wallet', () => {
            it('return the starthing Balance', () => {
                expect(Wallet.calculateBalance({
                    chain: blockchain.chain, address: wallet.publicKey
                })).toEqual(startingBalance)

            })
        })
        describe('and there are output for the wallet', () => {
            let transactionOne, transactionTwo
            beforeEach(() => {
                transactionOne = new Wallet().createTransaction({ recipent: wallet.publicKey, amount: 50 })
                transactionTwo = new Wallet().createTransaction({ recipent: wallet.publicKey, amount: 60 })
                blockchain.addBlock({ data: [transactionOne, transactionTwo] })
            })
            
            it('add the sume of all te output to the wallet', () => {
                expect(Wallet.calculateBalance({
                    chain: blockchain.chain, address: wallet.publicKey
                })).toEqual(startingBalance + transactionOne.outputMap[wallet.publicKey] + transactionTwo.outputMap[wallet.publicKey] )

            })
            describe('and the wallet has made a transaction', ()=>{
                let recentTransaction;

                beforeEach(()=>{
                    recentTransaction = wallet.createTransaction({recipent: 'foo-address',amount:30})

                    blockchain.addBlock({data: [recentTransaction]})

                })

                it('returen the output of the recentTransaction ', ()=>{
                    expect( Wallet.calculateBalance({chain: blockchain.chain, address: wallet.publicKey})).toEqual(recentTransaction.outputMap[wallet.publicKey])
                   
                })
                describe('and there are outputs next to and after the  recent transaction',()=>{
                    let sameBlocktransaction, nextBlockTransaction

                    beforeEach(()=>{
                        recentTransaction = wallet.createTransaction({recipent: 'later-foo-address', amount:60})
                        sameBlocktransaction = Transaction.rewardTransaction({minerWallet:wallet})
                        blockchain.addBlock({data: [recentTransaction, sameBlocktransaction]})

                        nextBlockTransaction = new Wallet().createTransaction({
                            recipent:wallet.publicKey, amount:75
                        })
                        blockchain.addBlock({data: [nextBlockTransaction]})
                    })
                    it('includes the output amount is the returwn balance', ()=>{
                        expect(Wallet.calculateBalance({chain: blockchain.chain, address:wallet.publicKey})).toEqual(recentTransaction.outputMap[wallet.publicKey]+sameBlocktransaction.outputMap[wallet.publicKey]+ nextBlockTransaction.outputMap[wallet.publicKey])
                    })

                })
            })

        })

    })




})