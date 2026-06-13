import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import AWS from "aws-sdk";
import { AppError } from "../utils/app-error";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export type StoredFile = {
  storageType: "LOCAL" | "S3";
  localPath: string | null;
  s3Key: string | null;
};

export const saveFile = async (
  file: Express.Multer.File,
  storageType: "LOCAL" | "S3",
): Promise<StoredFile> => {
  const extension = path.extname(file.originalname).toLowerCase();
  const fileName = `${randomUUID()}${extension}`;

  if (storageType === "LOCAL") {
    const uploadDir = path.resolve(process.env.UPLOAD_DIR || "uploads");
    await mkdir(uploadDir, { recursive: true });
    const fullPath = path.join(uploadDir, fileName);
    await writeFile(fullPath, file.buffer);
    return { storageType, localPath: fullPath, s3Key: null };
  }

  const bucket = process.env.AWS_S3_BUCKET;
  if (!bucket) throw new AppError(500, "AWS_S3_BUCKET is not configured");
  const key = `lab-reports/${fileName}`;
  await s3
    .upload({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ServerSideEncryption: "AES256",
    })
    .promise();
  return { storageType, localPath: null, s3Key: key };
};

export const getS3DownloadUrl = async (key: string) => {
  const bucket = process.env.AWS_S3_BUCKET;
  if (!bucket) throw new AppError(500, "AWS_S3_BUCKET is not configured");
  return s3.getSignedUrlPromise("getObject", {
    Bucket: bucket,
    Key: key,
    Expires: 300,
  });
};

export const deleteStoredFile = async (file: StoredFile) => {
  if (file.storageType === "LOCAL" && file.localPath) {
    await unlink(file.localPath).catch(() => undefined);
  }
  if (file.storageType === "S3" && file.s3Key) {
    const bucket = process.env.AWS_S3_BUCKET;
    if (bucket) {
      await s3.deleteObject({ Bucket: bucket, Key: file.s3Key }).promise();
    }
  }
};
