const TransactionPool = require('./transactioinPoot')
const Transaction = require('./transaction')
const Wallet = require('./index')

describe('Transaction Pool', ()=>{
    let transactioPool , transaction;
    beforeEach(()=>{
        transactioPool = new TransactionPool();
        transaction = new Transaction({
            senderWallet: new Wallet(),
            recipent : 'fack-recipient',
            amount: 50
        });

    })

    
})