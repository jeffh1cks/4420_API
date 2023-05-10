const mongoose = require('mongoose');
const Nft = require('../nftSchema.js');
const Ledger = require('../ledgerSchema.js');

function openDB() {
    const uri = 'mongodb://127.0.0.1:27017/4420';
    return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
}

function closeDB() {
    return mongoose.disconnect()
}

exports.closeDB = closeDB;


exports.getOwnership = function (params) {
  let output = []
  return new Promise((resolve, reject) => {
    openDB()
    .then(() => Nft.find())
    .then((res) => {
        for (let nft of res) {
            let obj = {}
            let nftDate = new Date(nft.lastbought)
            let nowDate = new Date()
            let secondsOwned = Math.round((nowDate - nftDate)/1000);
            
            obj.nftid = nft.id;
            obj.ownerid = nft.ownerid
            obj.secondsOwned = secondsOwned
            output.push(obj);
        }
    })
    .then(() => Ledger.find())
    .then((res) => {
        for (let ledger of res) {
            let obj = {}
            let secondsOwned = ledger.sellerdaysowned *24*60*60;
            obj.nftid = ledger.nftid;
            obj.ownerid = ledger.buyerid
            obj.secondsOwned = secondsOwned
            output.push(obj);
        }
    })
    .then(() => {
      closeDB();
      output.sort((a, b) => b.secondsOwned - a.secondsOwned)
      for (let i = 0; i < output.length - 1; i++) {
        for (let j = i + 1; j < output.length; j++) {
          if (output[i].nftid === output[j].nftid && output[i].ownerid === output[j].ownerid) {
            output[i].secondsOwned += output[j].secondsOwned;
            output.splice(j, 1);
            j--;
          }
        }
      }
      resolve(output)
    })
    .catch((err) => {
        console.error(`Error: ${err}`);
        reject({ code: 204, message: err.message });
    })
  })
}


