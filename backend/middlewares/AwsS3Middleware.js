import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";

dotenv.config();

// Initialize S3 client
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Configure Multer-S3 for file uploads
const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: "public-read", // Set access permissions (use "private" if files should not be publicly accessible)
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const uniqueFileName = `visa-documents/${Date.now()}_${file.originalname}`;
            cb(null, uniqueFileName);
        },
    }),
});

// Middleware for single file upload
export const singleUpload = upload.single("file");

// Delete file from S3
export const deleteFile = async (key) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    };

    try {
        await s3.deleteObject(params).promise();
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Generate a pre-signed URL for private file access
export const generatePresignedUrl = (key) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Expires: 60 * 60, // Link expiration time: 1 hour
    };

    return s3.getSignedUrl("getObject", params);
};
