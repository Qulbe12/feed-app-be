import mongoose, {Schema} from 'mongoose';
import {IFeedDto} from "../interfaces/IFeedDto";
// Define Mongoose schema for Car
const FeedSchema: Schema = new Schema({
    name: {type: String, required: true},
    comment: {type: String, required: true},
});

// Create and export Car model
const FeedModel = mongoose.model<IFeedDto>('Feed', FeedSchema);
export default FeedModel;
