import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../db";
import { AppError } from "../utils/app-error";

type DoctorInput = {
  name?: string;
  specialization?: string;
  licenseNumber?: string;
  email?: string;
  phone?: string;
};

const doctorSelect = `
  SELECT id, name, specialization, license_number AS licenseNumber, email,
         phone, created_at AS createdAt, updated_at AS updatedAt
  FROM doctors`;

export const createDoctor = async (input: DoctorInput) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO doctors (name, specialization, license_number, email, phone)
       VALUES (?, ?, ?, ?, ?)`,
      [
        input.name,
        input.specialization,
        input.licenseNumber,
        input.email,
        input.phone,
      ],
    );
    return getDoctorById(result.insertId);
  } catch (error: any) {
    if (error?.code === "ER_DUP_ENTRY") {
      throw new AppError(409, "Doctor email or license number already exists");
    }
    throw error;
  }
};

export const getAllDoctors = async () => {
  const [rows] = await pool.query(`${doctorSelect} ORDER BY id DESC`);
  return rows;
};

export const getDoctorById = async (id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `${doctorSelect} WHERE id = ?`,
    [id],
  );
  if (!rows[0]) throw new AppError(404, "Doctor not found");
  return rows[0];
};

export const updateDoctor = async (id: number, input: DoctorInput) => {
  const columns: Record<keyof DoctorInput, string> = {
    name: "name",
    specialization: "specialization",
    licenseNumber: "license_number",
    email: "email",
    phone: "phone",
  };
  const entries = Object.entries(input) as [keyof DoctorInput, unknown][];
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE doctors SET ${entries
      .map(([key]) => `${columns[key]} = ?`)
      .join(", ")} WHERE id = ?`,
    [...entries.map(([, value]) => value), id],
  );
  if (!result.affectedRows) throw new AppError(404, "Doctor not found");
  return getDoctorById(id);
};

export const deleteDoctor = async (id: number) => {
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM doctors WHERE id = ?",
    [id],
  );
  if (!result.affectedRows) throw new AppError(404, "Doctor not found");
};
