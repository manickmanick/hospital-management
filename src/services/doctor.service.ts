import pool from "../db";

export const createDoctor = async (
  name: string,
  specialization: string,
  email: string,
  phone: string
) => {
  const [result] = await pool.query(
    `INSERT INTO doctors
    (name, specialization, email, phone)
    VALUES (?, ?, ?, ?)`,
    [name, specialization, email, phone]
  );

  return result;
};

export const getAllDoctors = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM doctors"
  );

  return rows;
};

export const getDoctorById = async (
  id: number
) => {
  const [rows] = await pool.query(
    "SELECT * FROM doctors WHERE id = ?",
    [id]
  );

  return rows;
};