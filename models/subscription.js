const mongoose = require('mongoose');
const Schema = mongoose.Schema

const categorySchema = new Schema({
    subcat: { type: Schema.Types.ObjectId, ref: 'Type'},
    subscriptions: [
        {
            name: String,
            amount: Number,
            features: [
                {
                    type: String
                }
            ]
        }
    ]
});

module.exports = mongoose.model('Category', categorySchema);