import mongoose, {Document} from "mongoose";

export interface ICarDto {
    model: string;
    price: string;
    phoneNumber: string;
    maxPictures: number;
    pictures: string[];
    ownerId: mongoose.Types.ObjectId
}