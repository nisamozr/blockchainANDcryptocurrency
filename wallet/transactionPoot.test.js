const TransactionPool = require('./transactioinPoot')
const Transaction = require('./transaction')
const Wallet = require('./index')

describe('Transaction Pool', ()=>{
    let transactioPool , transaction, senderWallet;

    beforeEach(()=>{
        transactioPool = new TransactionPool();
        senderWallet = new Wallet()
        transaction = new Transaction({
            senderWallet,
            recipent : 'fack-recipient',
            amount: 50
        });

    })

    describe('setTransaction()', ()=>{
        it('add a transaction', () =>{
            transactioPool.setTransaction(transaction)
            expect(transactioPool.transactionMap[transaction.id]).toBe(transaction);
        })
    })
    describe('exisitingTransaction()', ()=>{
        it('return an exisitinf transaction given an input address', ()=>{
            transactioPool.setTransaction(transaction);

            expect(transactioPool.existingTransaction({inputAddress: senderWallet.publicKey})).toBe(transaction)
        })
    })


})