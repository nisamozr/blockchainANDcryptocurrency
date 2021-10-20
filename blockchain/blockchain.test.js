const Block = require("./block");
const Blockchain = require("./blockchain");
const cryptoHash = require("../util/cryptoHash");
const Wallet = require("../wallet");
const Transaction = require("../wallet/transaction");


describe('Blockchain()', () => {
    let blockchain, newChain, orginalChain, errorMock;
    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();
        errorMock = jest.fn()

        orginalChain = blockchain.chain;
        global.console.error = jest.fn()


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
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)

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

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)

                })
            })
            describe('chain contain a invalid field', () => {
                it('returns false', () => {

                    blockchain.chain[2].data = 'some-bad-and-evil-data';

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)

                })
            })

            describe('the chain contain a block with a jumped difficulty', () => {
                it('return flase', () => {
                    const lastBlock = blockchain.chain[blockchain.chain.length - 1];
                    const lastHase = lastBlock.hash;
                    const timestamp = Date.now();
                    const nonce = 0;
                    const data = []
                    const difficulty = lastBlock.difficulty - 3;

                    const hash = cryptoHash(timestamp, lastHase, difficulty, nonce, data)
                    const badBlock = new Block(timestamp, lastHase, hash, nonce, difficulty, data);
                    blockchain.chain.push(badBlock);

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                })
            })


            describe('chain cointain any invalid fiels', () => {
                it('return true', () => {

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);

                })
            })

        })

    })

    describe('replacement', () => {
        let logMock
        beforeEach(() => {

            logMock = jest.fn()
        })
        describe('when the new chain is not longer', () => {
            it('does not replace the chain', () => {
                newChain.chain[0] = { new: 'chain' };
                blockchain.replaceChain(newChain.chain);

                expect(blockchain.chain).toEqual(orginalChain);

            })
        })
    })

    describe('when the new chain is longer', () => {
        beforeEach(() => {
            newChain.addBlock({ data: 'bears' });
            newChain.addBlock({ data: 'beets' });
            newChain.addBlock({ data: 'baaaaaaaas' });
        })
        describe('the chain is invalid', () => {

            it('does not replace the chain', () => {
                newChain.chain[2] = 'some-fake-hash';
                blockchain.replaceChain(newChain.chain);

                expect(blockchain.chain).toEqual(orginalChain);

            })


        })
        describe('the chain is valid', () => {
            it('replace the chain', () => {
                blockchain.replaceChain(newChain.chain);


                expect(blockchain.chain).toEqual(newChain.chain);

            })

        })

    })

    // describe('validTransactionData()', () => {
    //     let transaction, rewardTransaction, wallet
    //     beforeEach(() => {
    //         wallet = new Wallet()
    //         transaction = wallet.createTransaction({ recipent: 'foo-addresss', amount: 75 })
    //         rewardTransaction = Transaction.rewardTransaction({ minerWallet: wallet })
    //     })

    //     describe('and the transaction data is valid', () => {
    //         it('return true', () => {
    //             newChain.addBlock({data :[transaction, rewardTransaction]})
    //             expect(blockchain.validTransactionData({chain:newChain.chain})).toBe(true)
    //             expect(errorMock).not.toHaveBeenCalled();

    //         })
    //     })
    //     describe('and the transaction data has multiple rewars', () => {
    //         it('return flase', () => {
    //             newChain.addBlock({ data : [transaction, rewardTransaction, rewardTransaction] })
    //             expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false)
    //             expect(errorMock).toHaveBeenCalled();



    //         })
    //     })
    //     describe('and the transcation data has at least one malformed outputMap', () => {
    //         describe('and the transaction is not a rewars transaction', () => {
    //             it('return flase', () => {
    //                 transaction.outputMap[wallet.publicKey] = 999999

    //                 newChain.addBlock({ data: [transaction, rewardTransaction] })

    //                 expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false)
    //                 expect(errorMock).toHaveBeenCalled();


    //             })

    //         })
    //         describe('and the transaction is a reward transaction', () => {
    //             it('return flase', () => {

    //                 rewardTransaction.outputMap[wallet.publicKey] = 999999
    //                 newChain.addBlock({ data: [transaction, rewardTransaction] })

    //                 expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false)
    //                 expect(errorMock).toHaveBeenCalled();


    //             })

    //         })
    //     })
    //     describe('and the transaction data has at least one malformed input', () => {
    //         it('return flase', () => {

    //         })
    //     })
    //     describe('and a block contains multiple identical tansactions', () => {
    //         it('return flase', () => {

    //         })
    //     })
    // })



})