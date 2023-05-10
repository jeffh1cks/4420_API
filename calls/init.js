const mongoose = require('mongoose');
const Counter = require('../counterSchema.js')
const Owner = require('../ownerSchema.js')
const Nft = require('../nftSchema.js')
const Ledger = require('../ledgerSchema.js')

mongoose.connect('mongodb://127.0.0.1:27017/4420', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let counters = [
    {_id:"ownerid", seq:0},
    {_id:"nftid", seq:0},
    {_id:"ledgerid", seq:0}
]

Owner.deleteMany()
.then(() => Nft.collection.drop())
.then(() => Ledger.collection.drop())
.then(() => Counter.collection.drop())
.then(() => Counter.insertMany(counters))
.then(() => {
    console.log('Counter initialized');
    mongoose.connection.close();
})
.catch((err) => {
    console.error(err.message)
})



