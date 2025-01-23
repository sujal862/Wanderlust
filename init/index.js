// to initialize the database
const mongoose = require('mongoose');
let data = require('./data.js'); // This will import the entire module
const Listing = require('../models/listing.js');

let MOONGOSE_URL = 'mongodb://127.0.0.1:27017/wanderlust';

async function main() {
    await mongoose.connect(MOONGOSE_URL);
}
main().then(() => console.log('MongoDB Connected. . .'.green.bgMagenta))
.catch(err => console.log(err.red));

const initDB = async () => {
    await Listing.deleteMany({});
    data = data.map((each) => ({
        ...each,
        owner: "678fc31adddf27f274df791c",
    }));
    await Listing.insertMany(data); //array of objects
    console.log('Data inserted');
}

initDB();
