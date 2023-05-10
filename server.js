const { jsonRes, jsonErr, validJRPC } = require('./utils.js');
const owner = require('./calls/owner.js')
const nft = require('./calls/nft.js')
const ledger = require('./calls/ledger.js')
const ownership = require('./calls/ownership.js')
const sql = require('./calls/sql.js')
const express = require("express")


const app = express();
const port = 4000;

//APPLY MIDDLEWARES
app.use(express.json());
app.use(validJRPC());

app.post('/owner', (req, res) => {
  let body = req.body
  if (!(body.method in owner)) {
    res.send(jsonErr(-32601, "Method is not available", body.id))
    return
  }
  let fn = owner[body.method]
  fn(body.params)
    .then((response) => {res.send(jsonRes(response, body.id))})
    .catch((error) => {res.send(jsonErr(error.code, error.message, body.id))});
})

app.post('/nft', (req, res) => {
  let body = req.body
  if (!(body.method in nft)) {
    res.send(jsonErr(-32601, "Method is not available", body.id))
    return
  }
  let fn = nft[body.method]
  fn(body.params)
    .then((response) => {res.send(jsonRes(response, body.id))})
    .catch((error) => {res.send(jsonErr(error.code, error.message, body.id))});
})

app.post('/ledger', (req, res) => {
  let body = req.body
  if (!(body.method in ledger)) {
    res.send(jsonErr(-32601, "Method is not available", body.id))
    return
  }
  let fn = ledger[body.method]
  fn(body.params)
    .then((response) => {res.send(jsonRes(response, body.id))})
    .catch((error) => {res.send(jsonErr(error.code, error.message, body.id))});
})
app.post('/ownership', (req, res) => {
  let body = req.body
  if (!(body.method in ownership)) {
    res.send(jsonErr(-32601, "Method is not available", body.id))
    return
  }
  let fn = ownership[body.method]
  fn(body.params)
    .then((response) => {res.send(jsonRes(response, body.id))})
    .catch((error) => {res.send(jsonErr(error.code, error.message, body.id))});
})

app.post('/sql', (req, res) => {
  let body = req.body
  if (!(body.method in sql)) {
    res.send(jsonErr(-32601, "Method is not available", body.id))
    return
  }
  let fn = sql[body.method]
  fn(body.params)
    .then((response) => {res.send(jsonRes(response, body.id))})
    .catch((error) => {res.send(jsonErr(error.code, error.message, body.id))});
})


app.listen(port, () => {
  console.log(`API listening on port ${port}`);
})
