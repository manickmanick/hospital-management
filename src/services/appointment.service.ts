import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../db";
import { AppError } from "../utils/app-error";

type Actor = {
  role: "ADMIN" | "DOCTOR" | "LAB";
  doctorId: number | null;
};

const ownershipClause = (actor: Actor) =>
  actor.role === "DOCTOR" ? " AND a.doctor_id = ?" : "";
const ownershipValues = (actor: Actor) =>
  actor.role === "DOCTOR" ? [actor.doctorId] : [];

export const createAppointment = async (
  input: {
    patientId: number;
    doctorId: number;
    appointmentDate: string;
    reason?: string | null;
  },
  actor: Actor,
) => {
  if (actor.role === "DOCTOR" && actor.doctorId !== input.doctorId) {
    throw new AppError(403, "Doctors can only create their own appointments");
  }

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO appointments
      (patient_id, doctor_id, appointment_date, reason)
     VALUES (?, ?, ?, ?)`,
    [
      input.patientId,
      input.doctorId,
      new Date(input.appointmentDate),
      input.reason || null,
    ],
  );
  return getAppointmentById(result.insertId, actor);
};

export const getAllAppointments = async (actor: Actor) => {
  const [rows] = await pool.query(
    `SELECT a.id, a.appointment_date AS appointmentDate, a.status, a.reason,
            p.id AS patientId, p.name AS patientName,
            d.id AS doctorId, d.name AS doctorName, d.specialization
     FROM appointments a
     JOIN patients p ON p.id = a.patient_id
     JOIN doctors d ON d.id = a.doctor_id
     WHERE 1 = 1 ${ownershipClause(actor)}
     ORDER BY a.appointment_date DESC`,
    ownershipValues(actor),
  );
  return rows;
};

export const getAppointmentById = async (id: number, actor: Actor) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT a.id, a.appointment_date AS appointmentDate, a.status, a.reason,
            p.id AS patientId, p.name AS patientName,
            d.id AS doctorId, d.name AS doctorName, d.specialization
     FROM appointments a
     JOIN patients p ON p.id = a.patient_id
     JOIN doctors d ON d.id = a.doctor_id
     WHERE a.id = ? ${ownershipClause(actor)}`,
    [id, ...ownershipValues(actor)],
  );
  if (!rows[0]) throw new AppError(404, "Appointment not found");
  return rows[0];
};

export const updateAppointmentStatus = async (
  id: number,
  status: string,
  actor: Actor,
) => {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE appointments a SET a.status = ?
     WHERE a.id = ? ${ownershipClause(actor)}`,
    [status, id, ...ownershipValues(actor)],
  );
  if (!result.affectedRows) throw new AppError(404, "Appointment not found");
  return getAppointmentById(id, actor);
};

export const deleteAppointment = async (id: number) => {
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM appointments WHERE id = ?",
    [id],
  );
  if (!result.affectedRows) throw new AppError(404, "Appointment not found");
};
