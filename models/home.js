const mongoose = require('mongoose');
const Schema = mongoose.Schema

const homeSchema = new Schema({
    services: [
        {
            icon: { type: String, default: 'fa fa-building-o'},
            color: { type: String, default: 'green'},
            serv: { type: Schema.Types.ObjectId, ref: 'Type'},
        }
    ],
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