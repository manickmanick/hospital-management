import { NextFunction, Request, Response } from "express";
import {
  createLabReport as saveLabReport,
  deleteLabReport as removeLabReport,
  getLabReportFile as findLabReportFile,
} from "../services/lab-report.service";
import { AppError } from "../utils/app-error";
import { getS3DownloadUrl } from "../services/storage.service";

export const createLabReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) throw new AppError(400, "file is required");
    const result = await saveLabReport(req.body, req.file, req.user!.id);
    res.status(201).json({ message: "Lab report uploaded", ...result });
  } catch (error) {
    next(error);
  }
};

export const getLabReportFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const report = await findLabReportFile(Number(req.params.id));
    if (report.storage_type === "LOCAL" && report.local_path) {
      res.type(report.mime_type);
      return res.sendFile(report.local_path);
    }
    if (report.s3_key) {
      return res.redirect(await getS3DownloadUrl(report.s3_key));
    }
    throw new AppError(404, "Stored file is missing");
  } catch (error) {
    next(error);
  }
};

export const deleteLabReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await removeLabReport(Number(req.params.id));
    res.json({ message: "Lab report deleted" });
  } catch (error) {
    next(error);
  }
};
