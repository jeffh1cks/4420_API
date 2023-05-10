const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/4420', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const Owner = require('../ownerSchema.js')

const owner1 = {ownerName: 'Jeff'}
const owners = [
  {ownerName: 'eff'},
  {ownerName: 'Jef'},
  {ownerName: 'Jff'},
  {ownerName: 'ff'},
]

// Owner.create(owner1)
Owner.insertMany(owners)
.then(() => {
    console.log('Owner added successfully!');
    mongoose.connection.close();
})
.catch((err) => console.error(err));
