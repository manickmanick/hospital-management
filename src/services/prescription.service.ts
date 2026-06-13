import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../db";
import { AppError } from "../utils/app-error";

type PrescriptionInput = {
  appointmentId: number;
  diagnosis: string;
  notes?: string | null;
  medicines: Array<{
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string | null;
  }>;
};

export const createPrescription = async (
  input: PrescriptionInput,
  doctorId: number | null,
) => {
  if (!doctorId) throw new AppError(403, "Doctor profile is not assigned");

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [appointments] = await connection.query<RowDataPacket[]>(
      `SELECT patient_id AS patientId, doctor_id AS doctorId, status
       FROM appointments WHERE id = ? FOR UPDATE`,
      [input.appointmentId],
    );
    const appointment = appointments[0];
    if (!appointment) throw new AppError(404, "Appointment not found");
    if (appointment.doctorId !== doctorId) {
      throw new AppError(403, "This appointment belongs to another doctor");
    }
    if (appointment.status !== "COMPLETED") {
      throw new AppError(
        400,
        "Prescription can only be saved after the appointment is completed",
      );
    }

    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO prescriptions
        (appointment_id, patient_id, doctor_id, diagnosis, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [
        input.appointmentId,
        appointment.patientId,
        doctorId,
        input.diagnosis,
        input.notes || null,
      ],
    );

    for (const medicine of input.medicines) {
      await connection.query(
        `INSERT INTO prescription_items
          (prescription_id, medicine_name, dosage, frequency, duration,
           instructions)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          result.insertId,
          medicine.medicineName,
          medicine.dosage,
          medicine.frequency,
          medicine.duration,
          medicine.instructions || null,
        ],
      );
    }

    await connection.commit();
    return { id: result.insertId, message: "Prescription saved" };
  } catch (error: any) {
    await connection.rollback();
    if (error?.code === "ER_DUP_ENTRY") {
      throw new AppError(409, "This appointment already has a prescription");
    }
    throw error;
  } finally {
    connection.release();
  }
};
