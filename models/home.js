const mongoose = require('mongoose');
const Schema = mongoose.Schema

const homeSchema = new Schema({
    chooseus: [
        {
            icon: { type: String},
            title: { type: String}
        }
    ],
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
            img: { type:  String},
            designation: { type: String}
        }
    ],
});

module.exports = mongoose.model('Home', homeSchema);