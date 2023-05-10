const mongoose = require('mongoose');
const Counter = require('./counterSchema.js');

const nftSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  ownerid: { type: Number },
  name: { type: String, required: true },
  price: { type: Number, required: true, default: 0.00 },
  createdon: { type: Date, default: Date.now() },
  lastbought: { type: Date, default: Date.now() },
  payloadtype: { type: String, default: null },
  payloadfilename: { type: String, default: null },
  payload: { type: String, default: null }
});

nftSchema.pre('validate', function(next) {
  var doc = this;
  Counter.findByIdAndUpdate({_id:'nftid'}, {$inc: {seq:1}}, {returnDocument: "after"})
    .then((res) => {
      console.log(res);
      this.id = res.seq;
      next();
    })
})
module.exports = mongoose.model('Nft', nftSchema);
