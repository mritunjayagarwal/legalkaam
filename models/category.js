const mongoose = require('mongoose');
const Schema = mongoose.Schema

const categorySchema = new Schema({
    name: { type: String, lowercase: true},
    subcat: [
        {
            type: Schema.Types.ObjectId, ref: 'Type'
        }
    ]
});

module.exports = mongoose.model('Category', categorySchema);