import multer from "multer";
import dotenv from "dotenv";
import { S3Client, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"; // Import this for presigned URL generation

dotenv.config(); // Load .env file

// Initialize S3 Client (AWS SDK v3)
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Use multer.memoryStorage to store files in memory temporarily
const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory for further S3 upload
});

// Middleware for handling single file upload
export const singleUpload = upload.single("file");

// Function to upload a file to S3
export const uploadFileToS3 = async (file, fileName) => {
  try {
    const upload = new Upload({
      client: s3Client, // AWS SDK v3 S3Client instance
      params: {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `visa-documents/${fileName}`, // File path in the S3 bucket
        Body: file.buffer, // File content as a buffer
        // Removed ACL setting as the bucket does not allow ACLs
        ACL: 'private', // You can either remove the ACL line or set it to 'private'
        ContentType: file.mimetype,
      },
    });

    const result = await upload.done(); // Perform file upload
    return result.Location; // Return the URL of the uploaded file
  } catch (error) {
    throw new Error(`File upload failed: ${error.message}`);
  }
};

// Function to delete a file from S3
export const deleteFile = async (key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(params)); // Delete file from S3
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Function to generate a pre-signed URL for private file access
export const generatePresignedUrl = async (fileName) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `visa-documents/${fileName}`,
    });
    // Generate a pre-signed URL valid for 1 hour
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return signedUrl;
  } catch (error) {
    throw new Error(`Error generating pre-signed URL: ${error.message}`);
  }
};

