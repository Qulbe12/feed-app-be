import mongoose, {Schema} from 'mongoose';
import {ICarDto} from "../interfaces/ICarDto";
// Define Mongoose schema for Car
const CarSchema: Schema = new Schema({
    model: { type: String },
    price: { type: String, required: true },
    phoneNumber: { type: String, required: true},
    maxPictures: { type: Number, required: true },
    pictures: [{ type: String }],
    ownerId: { type: Schema.Types.ObjectId, ref: 'Account', required: true }
});

// Create and export Car model
const CarModel = mongoose.model<ICarDto>('Car', CarSchema);
export default CarModel;
