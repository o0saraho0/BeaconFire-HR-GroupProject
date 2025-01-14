import mongoose from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";
import AWS from 'aws-sdk';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGO_URI);

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log("HR Group project server running at port " + PORT);
  });
});

console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY);



const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

s3.listBuckets((err, data) => {
    if (err) {
        console.error('S3 Connection Error:', err.message);
    } else {
        console.log('S3 Buckets:', data.Buckets);
    }
});