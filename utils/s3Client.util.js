import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import dotenv from "dotenv";

dotenv.config();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

export const uploadFile = multer({ storage });

export const createS3Client = () => {
  return new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
};

export const bucketName = process.env.AWS_S3_BUCKET_NAME;

const compressFile = async (localFilePath) => {
  const ext = path.extname(localFilePath).toLowerCase();
  const compressedPath = localFilePath.replace(/(\.\w+)$/, "_compressed$1");

  if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
    await sharp(localFilePath)
      .resize({ width: 1080 })
      .toFile(compressedPath);
  } else {
    return localFilePath;
  }

  return compressedPath;
};

export const uploadFileToS3 = async (localFilePath, pathName) => {
  const compressedFilePath = await compressFile(localFilePath);
  const fileContent = fs.readFileSync(compressedFilePath);
  const filename = path.basename(compressedFilePath);
  const contentType = mimeTypeFromFileExtension(path.extname(filename));

  const putCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: `${pathName}/${filename}`,
    Body: fileContent,
    ContentType: contentType,
    ACL: "public-read", // Remove this if ACLs are disabled on the bucket
  });

  const s3Client = createS3Client();
  await s3Client.send(putCommand);

  fs.unlinkSync(localFilePath);
  if (compressedFilePath !== localFilePath) fs.unlinkSync(compressedFilePath);

  return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${pathName}/${filename}`;
};

const mimeTypeFromFileExtension = (ext) => {
  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".pdf": "application/pdf",
  };
  return mimeTypes[ext.toLowerCase()] || "application/octet-stream";
};
