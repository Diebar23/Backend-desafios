import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    first_name: {
        type: String, 
        required: true
    },

    last_name : {
        type: String, 
        required: true
    },

    email : {
        type: String, 
        required: true,
        index: true, 
        unique: true
    }, 

    password: {
        type: String, 
        required: true
    },

    age : {
        type: Number, 
        required: true
    },

    cart: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "carts"},
        
    role: {
    type: String,
    default: "user"
    }
});

const UserModel = mongoose.model("user", userSchema);

export default UserModel;