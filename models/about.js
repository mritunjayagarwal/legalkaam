const mongoose = require('mongoose');
const Schema = mongoose.Schema

const aboutSchema = new Schema({
    heading: { type: String},
    quote: { type: String},
    desc: { type: String},
    descimg: { type: String},
    employees: [
        {
            name: { type: String},
            image: { type: String},
            designation: { type: String},
            desc: { type: String}
        }
    ],
});

module.exports = mongoose.model('About', aboutSchema);