import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../db";
import { AppError } from "../utils/app-error";
import {
  deleteStoredFile,
  saveFile,
  StoredFile,
} from "./storage.service";

type LabReportRow = RowDataPacket & {
  id: number;
  storage_type: "LOCAL" | "S3";
  local_path: string | null;
  s3_key: string | null;
  mime_type: string;
  original_file_name: string;
};

export const createLabReport = async (
  input: {
    patientId: number;
    testName: string;
    notes?: string | null;
    storageType: "LOCAL" | "S3";
  },
  file: Express.Multer.File,
  uploadedBy: number,
) => {
  const [patients] = await pool.query<RowDataPacket[]>(
    "SELECT id FROM patients WHERE id = ?",
    [input.patientId],
  );
  if (!patients[0]) throw new AppError(404, "Patient not found");

  const stored = await saveFile(file, input.storageType);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO lab_reports
        (patient_id, test_name, notes, storage_type, local_path, s3_key,
         original_file_name, mime_type, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.patientId,
        input.testName,
        input.notes || null,
        stored.storageType,
        stored.localPath,
        stored.s3Key,
        file.originalname,
        file.mimetype,
        uploadedBy,
      ],
    );
    return { id: result.insertId, fileUrl: `/api/lab-reports/${result.insertId}/file` };
  } catch (error) {
    await deleteStoredFile(stored);
    throw error;
  }
};

export const getLabReportFile = async (id: number) => {
  const [rows] = await pool.query<LabReportRow[]>(
    `SELECT id, storage_type, local_path, s3_key, mime_type, original_file_name
     FROM lab_reports WHERE id = ?`,
    [id],
  );
  if (!rows[0]) throw new AppError(404, "Lab report not found");
  return rows[0];
};

export const deleteLabReport = async (id: number) => {
  const report = await getLabReportFile(id);
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM lab_reports WHERE id = ?",
    [id],
  );
  if (!result.affectedRows) throw new AppError(404, "Lab report not found");
  await deleteStoredFile({
    storageType: report.storage_type,
    localPath: report.local_path,
    s3Key: report.s3_key,
  } satisfies StoredFile);
};
