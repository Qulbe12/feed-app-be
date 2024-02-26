// Import mongoose
import mongoose from "mongoose";
// Define the schema
const Schema = mongoose.Schema;
const accountSchema = new Schema({
    // Define your schema fields here
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Create a model
const Account = mongoose.model('Account', accountSchema);

export default Account
// module.exports = Account;
