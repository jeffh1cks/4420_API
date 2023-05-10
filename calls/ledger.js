const mongoose = require('mongoose');
const Ledger = require('../ledgerSchema.js');
const Nft = require('../nftSchema.js');
const Owner = require('../ownerSchema.js');
const {transferOwnership} = require('./owner.js');

function openDB() {
  const uri = 'mongodb://127.0.0.1:27017/4420';
  return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
}

function closeDB() {
  return mongoose.connection.close()
}

exports.createLedger = function (params) {
  if (!params.nftid || !params.buyerid || !params.buyerprice) {
    return Promise.reject({ code: 300, message: "Invalid params" });
  }

  let sellerID;
  return new Promise((resolve, reject) => {
    openDB()
    .then(() => Nft.findOne({id: params.nftid}))
    .then((res) => {
      let nft = res
      sellerID = nft.ownerid
      let sellerDate = new Date(nft.lastbought)
      const diffTime = Math.abs(new Date() - sellerDate);
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      return Ledger.create({
        nftid: params.nftid,
        buyerid: params.buyerid,
        sellerid: nft.ownerid,
        buyerprice: params.buyerprice,
        sellerprice: nft.price,
        sellerdaysowned: diffDays
      })
    })
    .then(() => Nft.findOneAndUpdate({id:params.nftid}, {
      ownerid: params.buyerid,
      price: params.buyerprice,
      lastbought: new Date()
    }))
    .then(() => Nft.findOne({id: params.nftid}))
    .then((res) => transferOwnership(res._id, params.buyerid, sellerID))
    .then(() => {
      resolve("Ledger Created! ");
      closeDB();
    })
    .catch((err) => {
        console.error(`Error: ${err}`);
        reject({ code: 301, message: err.message });
    })
})
}

exports.getLedger = function() {
  return new Promise((resolve, reject) => {
    openDB()
    .then(() => Ledger.find())
    .then((res) => {
      closeDB();
      resolve(res)
    })
    .catch((err) => {
        console.error(`Error: ${err}`);
        reject({ code: 302, message: err.message });
    })
  }) 
}


