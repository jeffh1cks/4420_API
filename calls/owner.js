const mongoose = require('mongoose');
const Owner = require('../ownerSchema.js'); // require Owner schema

function openDB() {
    const uri = 'mongodb://127.0.0.1:27017/4420';
    return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
}

function closeDB() {
    return mongoose.connection.close()
}

exports.createOwner = function (params) {
  if (!params.name) {
    return Promise.reject({ code: 200, message: "Invalid params" });
  }
  return new Promise((resolve, reject) => {
    const newOwner = {name: params.name};
    openDB()
    .then(() => Owner.create(newOwner))
    .then(() => {
      closeDB();
      resolve("Owner added successfully! ")
    })
    .catch((err) => {
        console.log(`Error: ${err}`);
        reject({ code: 201, message: err.message });
    })
})
}

exports.getOwners = function (params) {
  return new Promise((resolve, reject) => {
    openDB()
    .then(() => Owner.find().populate("nfts"))
    .then((res) => {
      closeDB();
      resolve(res)
    })
    .catch((err) => {
        console.log(`Error: ${err}`);
        reject({ code: 201, message: err.message });
    })
})
}
exports.transferOwnership = function (nftid, buyerid, sellerid) {
  return new Promise((resolve, reject) => {
    openDB()
    .then(() => Owner.findOneAndUpdate({id: buyerid}, {$push: {nfts: nftid}},{runValidators: false}))
    .then(() => Owner.findOneAndUpdate({id: sellerid}, {$pull: {nfts: nftid}},{runValidators: false}))
    .then((res) => {
      closeDB();
      resolve()
    })
    .catch((err) => {
        console.log(`Error: ${err}`);
        reject({ code: 202, message: err.message });
    })
})
}


