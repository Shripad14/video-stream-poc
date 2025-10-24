import express from "express";
import cors from "cors";
import multer from "multer";
import {v4 as uuidv4} from "uuid";
import path from "path";

import { PORT } from "./config/env.js";

const app = express();

const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];

// multer middleware
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./uploads");
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname))
    }
});

// multer configuration
const upload = multer({ storage: storage });

// Handling cors
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use((req, res, next) => {
    const origin = req.headers.origin;

    if(allowedOrigins.includes(origin)){
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Headers", "Origin", "X-Requested-With", "Content-Type", "Accept" );    
    }
    next(); 
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/uploads", express.static("uploads"));

app.get('/', (req, res) => {
    res.json({message: "Hello to video upload project"});
});

app.post("/upload", upload.single('file'), () => {
    console.log('File uploaded');
});

app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`)
} )
