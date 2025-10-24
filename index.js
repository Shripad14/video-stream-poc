import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs  from "fs";

import { exec } from "child_process";       
import {v4 as uuidv4} from "uuid";
import { PORT } from "./config/env.js";
import { stderr, stdout } from "process";

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

app.post("/upload", upload.single('file'), (req, res) => {
    
    // Generate url
    const lessonId = uuidv4();
    const videoPath = req.file.path;
    const outputPath = `./uploads/courses/${lessonId}`;
    const hlsPath = `${outputPath}/index.m3u8`;

    console.log('hlsPath:', hlsPath);

    if(!fs.existsSync(outputPath)){
        fs.mkdirSync(outputPath, { recursive: true });
    }

    // ffmpeg command
    const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 2 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;
   
    // no queue because of POC, not to be used in production
    exec(ffmpegCommand, (error, stdout, stderr) => {
       if(error){
        console.log(`exec error: ${error}`);
       } 

       console.log(`stdout: ${stdout}`);
       console.log(`stderr: ${stderr}`);
       const videoUrl = `http://localhost:${PORT}/uploads/courses/${lessonId}/index.m3u8`;
       
       res.status(200).json({ 
           message: "Video converted successfully to HLS format",
           videoUrl: videoUrl,
           lessonId: lessonId 
       });
    });

});

app.listen(PORT, () => {
    console.log(`App listening on http//localhost:${PORT}`)
})
