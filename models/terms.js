const mongoose = require('mongoose');
const Schema = mongoose.Schema

const termSchema = new Schema({
    type: { type: String},
    desc: { type: String},
    points: [
        {
            point: {type: String}
        }
    ]
});

module.exports = mongoose.model('Terms', termSchema);