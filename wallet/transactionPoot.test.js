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

    describe('validTransaction', ()=>{
        let validTransactions, errorMock;

        beforeEach(() =>{
            validTransactions = []
            errorMock =jest.fn()
            global.console.error =errorMock

            for(let i=0; i<10; i++){
                transaction = new Transaction({senderWallet, recipent:'any-resippent', amount:30})

                if(i%3 === 0){
                    transaction.input.amount = 999999
                }else if(i%3 === 1){
                    transaction.input.signature = new Wallet().sign('foo')
                }
                else{
                    validTransactions.push(transaction)
                }

                transactioPool.setTransaction(transaction)
            }
        })
        it('return valid transacton', ()=>{
            expect(transactioPool.validTransactions()).toEqual(validTransactions)
        })
        it('log erro for on validet transaction',()=>{
            transactioPool.validTransactions();
            expect(errorMock).toHaveBeenCalled()
        })
    })


})