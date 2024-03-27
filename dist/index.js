"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("./Models/user.model"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const vehicle_model_1 = __importDefault(require("./Models/vehicle.model"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const port = process.env.PORT || 3000;
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
mongoose_1.default.connect(process.env.MONGO_URL || "")
    .then(() => {
    console.log('Connected to MongoDB');
    // Middleware to ensure MongoDB connection is established before handling requests
    app.use((req, res, next) => {
        if (mongoose_1.default.connection.readyState !== 1) {
            return res.status(503).json({ error: 'MongoDB is not connected' });
        }
        next();
    });
    app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    }));
})
    .catch((error) => {
    console.error('Error connecting to MongoDB: ', error);
});
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
app.post('/sign-in', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({ error: 'Please provide a valid email and password' });
        }
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }
        return res.json({ message: 'Sign-in successful', user });
    }
    catch (error) {
        console.error('Error signing in:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.post('/add-vehicle', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { model, price, phoneNumber, maxPictures, pictures, userId } = req.body;
        if (!model || !price || !phoneNumber || !maxPictures || !pictures || !userId) {
            return res.status(401).json({ error: 'Please provide a valid details of vehicle' });
        }
        const user = yield user_model_1.default.findById(userId).select("-password");
        if (!user) {
            return res.status(401).json({ error: 'not authorized to add vehicle' });
        }
        const vehicle = yield vehicle_model_1.default.create({
            model, price, phoneNumber, maxPictures, pictures, ownerId: userId
        });
        return res.json(vehicle);
    }
    catch (error) {
        console.error('Error :', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}));
//# sourceMappingURL=index.js.map