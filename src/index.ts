import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';
import Account from "./Models/user.model";
import { seedAdminUser } from "./helpers/admin.seeder";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://SaadKhawajaProject:wBBO8JR4UXvqowOb@sk1.f4p6k.mongodb.net/VehicleAdd')
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

app.post('/signin', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({ error: 'Please provide a valid email and password' });
        }

        const user = await Account.findOne({ email });
    console.log(user)
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
