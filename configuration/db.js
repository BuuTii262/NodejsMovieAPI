const { MongoClient } = require("mongodb");

const _uri = process.env.MONGODB_URI;
const dbConneciton = (coll, cb) => {
    MongoClient.connect(_uri)
        .then(async(client) => {
            const db = client.db("sample_mflix").collection(coll);
            await cb(db);
            client.close();
        })
        .catch((err) => {
            console.log("have some error : ");
        });
};

module.exports = dbConneciton;