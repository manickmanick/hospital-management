import multer from "multer";
import { AppError } from "../utils/app-error";

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

export const uploadLabFile = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!allowedTypes.has(file.mimetype)) {
      return callback(
        new AppError(400, "Only JPEG, PNG, WebP, and PDF files are allowed"),
      );
    }
    callback(null, true);
  },
}).single("file");
