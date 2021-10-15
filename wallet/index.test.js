const Wallet = require('./index')
const {verifySignature} = require('../util');
const Transaction = require('./transaction');

describe('wallet', ()=>{
    let wallet;
    beforeEach(()=>{
        wallet = new Wallet();
    })

    it('has a balance', ()=>{
        expect(wallet).toHaveProperty('balance');
    })
    it('has a publick key', ()=>{
        // console.log(wallet.publicKey)
        expect(wallet).toHaveProperty('publicKey');
    })

    describe('siging data' ,()=>{
        const data = 'foobar'

        it('verify a signature', ()=>{
            expect(verifySignature({
                publicKey: wallet.publicKey,
                data,
                signature: wallet.sign(data)
            })).toBe(true)
           
        })
        it('does not verify an invalid signature', ()=>{
            expect(verifySignature({
                publicKey: wallet.publicKey,
                data,
                signature: new Wallet().sign(data)
            })).toBe(false)

        })

    })
    describe('creatTransaction()', ()=>{
        describe('and the amount exceed the balance', ()=>{
            it('throws an error', ()=>{
                expect(()=> wallet.createTransaction({amount:999999, recipent: 'foo-recipient'})).toThrow('Amount exceeds balance');
            })
           
        })

        describe('the amount is valid' , ()=>{
            let transaction, amount, recipent;

            beforeEach(()=>{
                    amount = 50; 
                    recipent = "foo-recipient"
                    transaction = wallet.createTransaction({amount, recipent})
            })

            it('create an intance of transaction', ()=>{
                expect(transaction instanceof Transaction).toBe(true)

            })
            it('matches the transaction input with the wallet', ()=>{
                expect(transaction.input.address).toEqual(wallet.publicKey)

            })
            it('outupt the amount the recipient', ()=>{ 
                expect(transaction.outputMap[recipent]).toEqual(amount)

            })

        })
    })
    

    

})