import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';
import Account from "./Models/user.model";
import { seedAdminUser } from "./helpers/admin.seeder";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import VehicleModel from "./Models/vehicle.model";
import cors from "cors"

dotenv.config();

const app: Express = express();
app.use(cors())
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL || "")
    .then(() => {
        console.log('Connected to MongoDB');

        // Middleware to ensure MongoDB connection is established before handling requests
        app.use((req: Request, res: Response, next: Function) => {
            if (mongoose.connection.readyState !== 1) {
                return res.status(503).json({ error: 'MongoDB is not connected' });
            }
            next();
        });

        app.listen(port, async () => {
            console.log(`[server]: Server is running at http://localhost:${port}`);
           await seedAdminUser();
        });
    })
    .catch((error: Error) => {
        console.error('Error connecting to MongoDB: ', error);
    });

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.post('/sign-in', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(401).json({ error: 'Please provide a valid email and password' });
        }

        const user = await Account.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        return res.json({ message: 'Sign-in successful', user });

    } catch (error) {
        console.error('Error signing in:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/add-vehicle', async (req: Request, res: Response) => {
    try {
        const { model, price , phoneNumber , maxPictures , pictures , userId } = req.body;

        if (!model || !price || !phoneNumber || !maxPictures || !pictures || !userId ) {
            return res.status(401).json({ error: 'Please provide a valid details of vehicle' });
        }

        const user = await Account.findById(userId).select("-password");

        if (!user){
            return res.status(401).json({ error: 'not authorized to add vehicle' });
        }

        const vehicle = await VehicleModel.create({
            model, price , phoneNumber , maxPictures , pictures , ownerId :userId
        })
        return res.json(vehicle);

    } catch (error) {
        console.error('Error :', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
