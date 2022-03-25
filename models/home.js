const mongoose = require('mongoose');
const Schema = mongoose.Schema

const homeSchema = new Schema({
    features: [
        {
            head: { type: String},
            desc: { type: String}
        }
    ],
    youtube: { type: String},
    testimonials: [
        {
            quote: { type: String},
            name: { type: String},
            designation: { type: String}
        }
    ],
});

module.exports = mongoose.model('Home', homeSchema);