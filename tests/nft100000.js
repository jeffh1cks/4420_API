const mongoose = require('mongoose');
const {createNftBulk, closeDB} = require('../calls/nft.js');

let startTime = new Date()

const promises = []

for (let i = 1; i <= 1000; i++) {
    let params = {
		"name": `Test ${i}`,
		"price": i,
		"payload": `Payload ${i}`
    }
    promises.push(createNftBulk(params))
}
Promise.all(promises)
.then(() => {
    let stopTime = new Date()
    let totalTime = stopTime - startTime
    console.log(totalTime)
    closeDB();
    return;
})
.catch((err) => {console.error(err)})
