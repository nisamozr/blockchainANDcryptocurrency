const express = require('express');
require('dotenv').config()
// const bodyParser = require('body-parser')
const request = require('request')
const path = require('path')
const indexRouter = require('./router/index')


const Blockchain = require('./blockchain/blockchain');
const PubSub = require('./app/pubsub')
const TransactionPool = require('./wallet/transactioinPoot')
const Wallet = require('./wallet/index')
const TransactionMiner = require('./app/transactionMinert')

const isDevelopment = process.env.ENV = 'development';

// const Defalt_Port = process.env.PORT;
const Defalt_Port = 5000;
const host = process.env.HOST;
// const rootNodeAddress = `http://${host}:${Defalt_Port}`;
const rootNodeAddress = `http://localhost:50000`;
const REDIS_URL = isDevelopment ? 'redis://127.0.0.1:6379' : 'redis-cli -h blockchain.u3rmdk.0001.aps1.cache.amazonaws.com -p 6379'



const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool()
const pubsub = new PubSub({ blockchain, transactionPool , redisUrl:REDIS_URL})
const wallet = new Wallet()
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub })


// app.use(bodyParser.json());
app.use(express.json({}));
// app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/client/dist')))

app.use("/", indexRouter);

const syncWithRootStat = () => {
    request({ url: `${rootNodeAddress}/api/blocks` }, (error, res, body) => {
        if (!error && res.statusCode === 200) {
            const rootChain = JSON.parse(body)

            console.log('replace on a synce withw', rootChain)

            blockchain.replaceChain(rootChain)


        }
    })
    request({ url: `${rootNodeAddress}/api/transaction-pool-map` }, (error, res, body) => {
        if (!error && res.statusCode === 200) {
            const rootTransactionPoolMap = JSON.parse(body)

            console.log('replace transaction pool map on a sync with', rootTransactionPoolMap)
            transactionPool.setMap(rootTransactionPoolMap)
        }

    })
}
if (isDevelopment) {

    const walletFoo = new Wallet()
    const walletBar = new Wallet()

    const grneratWalletTransaction = ({ wallet, recipent, amount }) => {
        const transaction = wallet.createTransaction({
            recipent, amount, chain: blockchain.chain
        })

        transactionPool.setTransaction(transaction)
    }

    const walletAction = () => grneratWalletTransaction({ wallet, recipent: walletFoo.publicKey, amount: 5 })

    const walletFooAction = () => grneratWalletTransaction({ wallet: walletFoo, recipent: walletBar.publicKey, amount: 10 })
    const walletBarAction = () => grneratWalletTransaction({ wallet: walletBar, recipent: wallet.publicKey, amount: 15 })

    for (let i = 0; i < 10; i++) {
        if (i % 3 === 0) {
            walletAction()
            walletFooAction
        }
        else if (i % 3 === 1) {
            walletAction()
            walletBarAction()
        } else {
            walletFooAction()
            walletBarAction()
        }

        transactionMiner.mineTransactions();
    }
}

    let peerPort;

    if (process.env.GENERTE_PEER_PORT === 'true') {
        peerPort = Defalt_Port + Math.ceil(Math.random() * 1000)
    }
    const PORT = process.env.PORT || peerPort || Defalt_Port;
    app.listen(PORT, () => {
        console.log(`listing at localhost:${PORT}`)
        if (PORT !== Defalt_Port) {
            syncWithRootStat();
        }

    })


    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get("env") === "development" ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render("error");
    });