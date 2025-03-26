import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error("Missing AWS credentials");
}

const s3Client = new S3Client({
  region: "eu-central-1",
  endpoint: "https://s3.eu-central-1.amazonaws.com",
  forcePathStyle: false,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = "dabelo-meal-app";

export async function uploadFile(
  file: Buffer,
  mimeType: string
): Promise<string> {
  const fileKey = `meals/${crypto.randomUUID()}${getExtension(mimeType)}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: file,
      ContentType: mimeType,
    })
  );

  return `https://${BUCKET_NAME}.s3.eu-central-1.amazonaws.com/${fileKey}`;
}

function getExtension(mimeType: string): string {
  const extensions: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
  };
  return extensions[mimeType] || ".jpg";
}
