const mongoose = require('mongoose');
const Nft = require('../nftSchema.js');
const Owner = require('../ownerSchema.js');

function openDB() {
    const uri = 'mongodb://127.0.0.1:27017/4420';
    return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
}

function closeDB() {
    return mongoose.disconnect()
}

exports.closeDB = closeDB;

exports.createNft = function (params) {
  if (!params.name || !params.price) {
    return Promise.reject({ code: 200, message: "Invalid params" });
  }

  return new Promise((resolve, reject) => {
    openDB()
    .then(() => Nft.create(params))
    .then((res) => {
      if(params.ownerid) {
        return Owner.findOneAndUpdate({id: params.ownerid}, 
          {$push: {nfts: res._id}},{runValidators: false}
          );
      }
      return Promise.resolve();
    })
    .then(() => closeDB())
    .then(() => resolve("NFT added successfully! "))
    .catch((err) => {
        console.error(`Error: ${err}`);
        reject({ code: 203, message: err.message });
    })
})
}

exports.getNfts = function (params) {
  return new Promise((resolve, reject) => {
    openDB()
    .then(() => Nft.find())
    .then((res) => {
      closeDB();
      resolve(res)
    })
    .catch((err) => {
        console.error(`Error: ${err}`);
        reject({ code: 204, message: err.message });
    })
})
}


