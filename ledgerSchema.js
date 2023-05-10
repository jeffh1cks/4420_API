const mongoose = require('mongoose');
const Counter = require('./counterSchema.js');

const ledgerSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true, index: true},
    nftid: {type: Number, required: true, index: true},
    buyerid: {type: Number, required: true, index: true},
    sellerid: {type: Number, default: null, index: true},
    buyerprice: {type: Number, required: true,default: 0.00},
    sellerprice: {type: Number, required: true,default: 0.00},
    sellerdaysowned: {type: Number, default: 0.0},
    changedon: {type: Date, default: Date.now}
});
ledgerSchema.pre('validate', function(next) {
    var doc = this;
    Counter.findByIdAndUpdate({_id:'ledgerid'}, {$inc: {seq:1}}, {returnDocument: "after"})
      .then((res) => {
        this.id = res.seq;
        next();
      })
  })

module.exports = mongoose.model('Ledger', ledgerSchema);




