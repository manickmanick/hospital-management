import pool from "../db";

export const createAppointment = async (
  patientId: number,
  doctorId: number,
  appointmentDate: string
) => {
  const [result] = await pool.query(
    `
    INSERT INTO appointments
    (patient_id, doctor_id, appointment_date)
    VALUES (?, ?, ?)
    `,
    [patientId, doctorId, appointmentDate]
  );

  return result;
};

export const getAllAppointments = async () => {
  const [rows] = await pool.query(`
    SELECT
      a.id,
      a.appointment_date,
      a.status,

      p.id AS patient_id,
      p.name AS patient_name,

      d.id AS doctor_id,
      d.name AS doctor_name,
      d.specialization

    FROM appointments a

    JOIN patients p
      ON a.patient_id = p.id

    JOIN doctors d
      ON a.doctor_id = d.id
  `);

  return rows;
};

export const getAppointmentById = async (
  id: number
) => {
  const [rows] = await pool.query(
    `
    SELECT
      a.*,
      p.name AS patient_name,
      d.name AS doctor_name

    FROM appointments a

    JOIN patients p
      ON p.id = a.patient_id

    JOIN doctors d
      ON d.id = a.doctor_id

    WHERE a.id = ?
    `,
    [id]
  );

  return rows;
};

export const updateAppointmentStatus = async (
  id: number,
  status: string
) => {
  const [result] = await pool.query(
    `
    UPDATE appointments
    SET status = ?
    WHERE id = ?
    `,
    [status, id]
  );

  return result;
};

export const deleteAppointment = async (
  id: number
) => {
  const [result] = await pool.query(
    `
    DELETE FROM appointments
    WHERE id = ?
    `,
    [id]
  );

  return result;
};