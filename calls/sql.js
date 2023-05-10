const sqlite3 = require('sqlite3').verbose();
const filename = "/home/jeff/api/calls/data/app.db"

function openDB() {
    const db = new sqlite3.Database(filename, (err) => {
        if (err) {
            console.error(err.message);
        }
    });
    //console.log('Connected to the database.'); 
    return db;
}

function closeDB(db) {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        //console.log('Closed the database connection.');
    });
}

exports.createOwner = function(params) {
    if (!params.name) {
        return Promise.reject({ code: 200, message: "Invalid params" });
    }
    return new Promise((resolve, reject) => {
        let db = openDB()
        const sql = 'INSERT INTO owner (ownername) VALUES (?)';
        const stmt = db.prepare(sql);
        stmt.run(params.name, function(err) {
            if (err) {
                console.error(err)
                reject(err.message);
            } else {
                resolve("Owner added successfully!");
            }
        });
        stmt.finalize();
        closeDB(db);
    })
    .catch((err) => {
        console.error(err);
        return Promise.reject({ code: 500, message: "Internal Server Error" });
    });
}
exports.getOwners = function (params) {
    return new Promise((resolve, reject) => {
        let db = openDB()
        const sql = "SELECT owner.*, count(nftid) as NFTs FROM owner left join nft on owner.ownerid = nft.ownerid  group by owner.ownerid order by ownerid desc";
        const stmt = db.prepare(sql);
        stmt.all(params.name, function(err,rows) {
            if (err) {
                console.error(err)
                reject(err.message);
            } else {
                resolve(rows);
            }
        });
        stmt.finalize();
        closeDB(db);
    })
    .catch((err) => {
        console.error(err);
        return Promise.reject({ code: 500, message: "Internal Server Error" });
    });
}
exports.createNft = function (params) {
    if (!params.nftname || !params.price || !params.ownerid || !params.payload) {
      return Promise.reject({ code: 200, message: "Invalid params" });
    }
    const nftname = params.nftname;
    const nftprice = params.price;
    const nftowner = params.ownerid;
    const payload = params.payload;

    return new Promise((resolve, reject) => {
        let db = openDB()
        const sql = "INSERT INTO nft (nftname, price, ownerid, payload) VALUES (?,?,?,?)";
        const stmt = db.prepare(sql);
        stmt.run([nftname, nftprice, nftowner,payload], function(err) {
            if (err) {
                console.error(err)
                reject(err.message);
            } else {
                resolve("Nft added successfully");
            }
        });
        stmt.finalize();
        closeDB(db);
    })
    .catch((err) => {
        console.error(err);
        return Promise.reject({ code: 500, message: "Internal Server Error" });
    });
}
exports.getNfts = function (params) {
    return new Promise((resolve, reject) => {
        let db = openDB()
        const sql = "SELECT *,  length(payload) as bytes FROM nft order by createdon desc";
        const stmt = db.prepare(sql);
        stmt.all(params.name, function(err,rows) {
            if (err) {
                console.error(err)
                reject(err.message);
            } else {
                resolve(rows);
            }
        });
        stmt.finalize();
        closeDB(db);
    })
    .catch((err) => {
        console.error(err);
        return Promise.reject({ code: 500, message: "Internal Server Error" });
    });
}

exports.createLedger = function(params) {
    if (!params.nftid || !params.buyerid || !params.buyerprice) {
      return Promise.reject({ code: 300, message: "Invalid params" });
    }
    return new Promise((resolve, reject) => {
      let db = openDB();
      let owners = [];
      let ledger = {};
      let buyerid; 
      let sql = "SELECT ownerid FROM owner WHERE ownerid = (?)";
      let stmt = db.prepare(sql);
      stmt.all(params.buyerid, function(err, rows) {
        if (err) {
          console.error(err);
          reject(err.message);
        } else {
          rows.forEach(function(row) {
            owners.push(row.ownerid);
          });
          ledger.buyerid = owners[0];
          ledger.buyerprice = params.buyerprice

  
          sql = "SELECT ownerid, nftid, price, julianday(CURRENT_TIMESTAMP) - julianday(lastbought) AS daysowned FROM nft WHERE nftid = (?)";
          stmt = db.prepare(sql);
          stmt.all(params.nftid, function(err, rows) {
            if (err) {
              console.error(err);
              reject(err.message);
            } else {
                rows.forEach(function(row) {
                    ledger.nftid = row.nftid
                    ledger.sellerid = row.ownerid
                    ledger.sellerprice = row.price
                    ledger.sellerdaysowned = row.daysowned
                });
            }
            if (ledger.buyerid && ledger.nftid) {
                sql = "INSERT INTO ledger (nftid, buyerid, buyerprice, sellerid, sellerprice, sellerdaysowned) VALUES (?, ?, ?, ?, ?, ?)"
                stmt = db.prepare(sql);
                stmt.run([ledger.nftid, ledger.buyerid, ledger.buyerprice, ledger.sellerid, ledger.sellerprice, ledger.sellerdaysowned], function(err) {
                    if (err) {
                        console.error(err)
                        reject(err.message);
                    } else {
                        resolve("Ledger added successfully!");
                    }
                });
            }
            stmt.finalize();
            closeDB(db);
          });
        }
      });
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject({ code: 500, message: "Internal Server Error" });
    });
  }
  

exports.getLedger = function(params) {
    return new Promise((resolve, reject) => {
        let db = openDB()
        const sql = "SELECT * FROM ledger";
        const stmt = db.prepare(sql);
        stmt.all(params.name, function(err,rows) {
            if (err) {
                console.error(err)
                reject(err.message);
            } else {
                resolve(rows);
            }
        });
        stmt.finalize();
        closeDB(db);
    })
    .catch((err) => {
        console.error(err);
        return Promise.reject({ code: 500, message: "Internal Server Error" });
    });
}

exports.getOwnership = function (params) {
    let output = []
    return new Promise((resolve, reject) => {
        let db = openDB()
        const sql =`SELECT nftid, ownerid, round((sum(daysowned)* 24 * 3600),2) as secondsowned
        From 
        (
        SELECT nftid, ownerid, (julianday(current_timestamp) - julianday(lastbought)) as daysowned from nft
        Union all
        SELECT nftid, sellerid as ownerid, SUM(sellerdaysowned) as daysowned from ledger group by nftid, sellerid
        )
        Group by nftid, ownerid order by round((sum(daysowned) *24*3600),2) desc`;

        const stmt = db.prepare(sql);
        stmt.all(params.name, function(err,rows) {
            if (err) {
                console.error(err)
                reject(err.message);
            } else {
                resolve(rows);
            }
        });
        stmt.finalize();
        closeDB(db);
    })
    .catch((err) => {
        console.error(err);
        return Promise.reject({ code: 500, message: "Internal Server Error" });
    });
}



