const mongoose = require('mongoose');
const Schema = mongoose.Schema

const subSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category'},
    name: { type: String, lowercase: true},
    subcat: [
        {
            type: Schema.Types.ObjectId, ref: 'Type'
        }
    ]
});

module.exports = mongoose.model('Sub', subSchema);