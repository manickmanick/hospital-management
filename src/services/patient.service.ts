import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../db";
import { AppError } from "../utils/app-error";
import { deleteStoredFile } from "./storage.service";

type PatientInput = {
  name?: string;
  dateOfBirth?: string | null;
  age?: number;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  phone?: string;
  email?: string | null;
  address?: string | null;
  bloodGroup?: string | null;
  allergies?: string | null;
  emergencyContact?: string | null;
};

const patientSelect = `
  SELECT id, name, date_of_birth AS dateOfBirth, age, gender, phone, email,
         address, blood_group AS bloodGroup, allergies,
         emergency_contact AS emergencyContact, created_at AS createdAt,
         updated_at AS updatedAt
  FROM patients`;

export const getAllPatients = async () => {
  const [rows] = await pool.query(`${patientSelect} ORDER BY id DESC`);
  return rows;
};

export const getPatientById = async (id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `${patientSelect} WHERE id = ?`,
    [id],
  );
  if (!rows[0]) throw new AppError(404, "Patient not found");
  return rows[0];
};

export const createPatient = async (input: PatientInput) => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO patients
      (name, date_of_birth, age, gender, phone, email, address, blood_group,
       allergies, emergency_contact)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.name,
      input.dateOfBirth || null,
      input.age ?? null,
      input.gender || null,
      input.phone,
      input.email || null,
      input.address || null,
      input.bloodGroup || null,
      input.allergies || null,
      input.emergencyContact || null,
    ],
  );
  return getPatientById(result.insertId);
};

export const updatePatient = async (id: number, input: PatientInput) => {
  const columns: Record<keyof PatientInput, string> = {
    name: "name",
    dateOfBirth: "date_of_birth",
    age: "age",
    gender: "gender",
    phone: "phone",
    email: "email",
    address: "address",
    bloodGroup: "blood_group",
    allergies: "allergies",
    emergencyContact: "emergency_contact",
  };
  const entries = Object.entries(input) as [keyof PatientInput, unknown][];
  const assignments = entries.map(([key]) => `${columns[key]} = ?`).join(", ");
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE patients SET ${assignments} WHERE id = ?`,
    [...entries.map(([, value]) => value), id],
  );
  if (!result.affectedRows) throw new AppError(404, "Patient not found");
  return getPatientById(id);
};

export const deletePatient = async (id: number) => {
  const [files] = await pool.query<RowDataPacket[]>(
    `SELECT storage_type AS storageType, local_path AS localPath,
            s3_key AS s3Key
     FROM lab_reports WHERE patient_id = ?`,
    [id],
  );
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM patients WHERE id = ?",
    [id],
  );
  if (!result.affectedRows) throw new AppError(404, "Patient not found");
  await Promise.all(
    files.map((file) =>
      deleteStoredFile({
        storageType: file.storageType,
        localPath: file.localPath,
        s3Key: file.s3Key,
      }),
    ),
  );
};

export const getPatientHistory = async (id: number) => {
  const patient = await getPatientById(id);
  const [appointments, prescriptions, medicines, labReports] =
    await Promise.all([
      pool.query<RowDataPacket[]>(
        `SELECT a.id, a.appointment_date AS appointmentDate, a.status, a.reason,
                d.id AS doctorId, d.name AS doctorName, d.specialization
         FROM appointments a
         JOIN doctors d ON d.id = a.doctor_id
         WHERE a.patient_id = ? ORDER BY a.appointment_date DESC`,
        [id],
      ),
      pool.query<RowDataPacket[]>(
        `SELECT p.id, p.appointment_id AS appointmentId, p.diagnosis, p.notes,
                p.created_at AS prescribedAt, d.id AS doctorId,
                d.name AS doctorName
         FROM prescriptions p
         JOIN doctors d ON d.id = p.doctor_id
         WHERE p.patient_id = ? ORDER BY p.created_at DESC`,
        [id],
      ),
      pool.query<RowDataPacket[]>(
        `SELECT pi.id, pi.prescription_id AS prescriptionId,
                pi.medicine_name AS medicineName, pi.dosage, pi.frequency,
                pi.duration, pi.instructions
         FROM prescription_items pi
         JOIN prescriptions p ON p.id = pi.prescription_id
         WHERE p.patient_id = ? ORDER BY pi.id`,
        [id],
      ),
      pool.query<RowDataPacket[]>(
        `SELECT id, test_name AS testName, notes, storage_type AS storageType,
                original_file_name AS originalFileName, mime_type AS mimeType,
                uploaded_at AS uploadedAt
         FROM lab_reports WHERE patient_id = ? ORDER BY uploaded_at DESC`,
        [id],
      ),
    ]);

  const itemsByPrescription = new Map<number, RowDataPacket[]>();
  for (const item of medicines[0]) {
    const list = itemsByPrescription.get(item.prescriptionId) || [];
    list.push(item);
    itemsByPrescription.set(item.prescriptionId, list);
  }

  return {
    patient,
    appointments: appointments[0],
    prescriptions: prescriptions[0].map((prescription) => ({
      ...prescription,
      medicines: itemsByPrescription.get(prescription.id) || [],
    })),
    labReports: labReports[0].map((report) => ({
      ...report,
      fileUrl: `/api/lab-reports/${report.id}/file`,
    })),
  };
};
