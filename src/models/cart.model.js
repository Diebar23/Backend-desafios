import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref:'Product',
                required: true
            },
            quantity: {
                type: Number, 
                required: true
            }
        }
    ]
});

// Middleware que realiza la población automáticamente

cartSchema.pre('findOne', function (next) {
    this.populate('products.product', '_id title price');
    next();
  });

const CartModel = mongoose.model("carts", cartSchema);

export default CartModel;