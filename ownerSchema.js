const mongoose = require('mongoose');
const Counter = require('./counterSchema.js');


const ownerSchema = new mongoose.Schema({
  id: { type: Number, required:true, unique: true},
  name: { type: String, required: true },
  nfts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Nft"
    }
  ]
});

ownerSchema.pre('validate', function(next) {
  var doc = this;
  Counter.findByIdAndUpdate({_id:'ownerid'}, {$inc: {seq:1}}, {returnDocument: "after"})
    .then((res) => {
      this.id = res.seq;
      next();
    })
})

module.exports = mongoose.model('Owner', ownerSchema);