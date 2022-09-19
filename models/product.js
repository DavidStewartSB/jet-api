const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 150
    },
    price: {
        type: String,
        required: true
    },
    promo: {
        type: Number,
        requerid: true
    },
    countInStock: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    images: {
        type: Array,
        default: ''
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
})

productSchema.virtual('id').get(function() {
    return this._id.toHexString();
})
productSchema.set('toJSON', {
    virtuals: true
})

exports.Product = mongoose.model("Product", productSchema)