const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        image: { type: String, required: true },
        type: { type: String, required: true },
        price: { type: Number, required: true, min: [0, 'Giá phải lớn hơn hoặc bằng 0'] },
        oldPrice: { type: Number, min: [0, 'Giá phải lớn hơn hoặc bằng 0'] },
        selled: { type: Number, min: [0, 'Số lượng phải lớn hơn hoặc bằng 0'] },
        countInStock: { type: Number, required: true, min: [0, 'Số lượng trong kho không được âm'], default: 0 },
        rating: {
            type: Number,
            required: true,
            min: [0, 'Đánh giá phải >= 0'],
            max: [5, 'Đánh giá phải <= 5'],
            default: 0,
        },
        description: { type: String },
    },
    {
        timestamps: true,
    },
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
