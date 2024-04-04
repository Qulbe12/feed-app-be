import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import FeedModel from "./Models/feed.model";
import cors from "cors"


dotenv.config();

const app: Express = express();
app.use(cors())
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL || "")
    .then(() => {
        console.log('Connected to MongoDB');

        // Middleware to ensure MongoDB connection is established before handling requests
        app.use((req: Request, res: Response, next: Function) => {
            if (mongoose.connection.readyState !== 1) {
                return res.status(503).json({error: 'MongoDB is not connected'});
            }
            next();
        });

        app.listen(port, async () => {
            console.log(`[server]: Server is running at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error('Error connecting to MongoDB: ', error);
    });

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.post('/add-feed', async (req: Request, res: Response) => {
    try {
        const {name, comment} = req.body;

        if (!name || !comment) {
            return res.status(401).json({error: 'Please provide a valid data'});
        }

        const feed = await FeedModel.create({
            name,
            comment
        })
        return res.json(feed);

    } catch (error) {
        console.error('Error :', error);
        return res.status(500).json({error: 'Internal Server Error'});
    }
});
app.get('/get-all-feeds', async (req: Request, res: Response) => {
    try {
        const feeds = await FeedModel.find().exec()
        return res.json(feeds);

    } catch (error) {
        console.error('Error :', error);
        return res.status(500).json({error: 'Internal Server Error'});
    }
});
