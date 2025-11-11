"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
dotenv.config();
async function purgeS3Bucket() {
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
        console.error('AWS credentials or bucket name not found in environment variables');
        process.exit(1);
    }
    const s3Client = new client_s3_1.S3Client({
        region,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    });
    console.log(`Purging objects from S3 bucket: ${bucketName}`);
    try {
        const listedObjects = await s3Client.send(new client_s3_1.ListObjectsV2Command({ Bucket: bucketName }));
        if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
            console.log('No objects found in the bucket.');
            return;
        }
        const objects = listedObjects.Contents.map((object) => ({
            Key: object.Key,
        }));
        const BATCH_SIZE = 1000;
        for (let i = 0; i < objects.length; i += BATCH_SIZE) {
            const batch = objects.slice(i, i + BATCH_SIZE);
            await s3Client.send(new client_s3_1.DeleteObjectsCommand({
                Bucket: bucketName,
                Delete: { Objects: batch },
            }));
            console.log(`Deleted ${batch.length} objects (batch ${i / BATCH_SIZE + 1})`);
        }
        console.log(`Successfully purged ${objects.length} objects from bucket: ${bucketName}`);
    }
    catch (error) {
        console.error('Error purging S3 bucket:', error);
        process.exit(1);
    }
}
purgeS3Bucket();
//# sourceMappingURL=purge-s3.js.map