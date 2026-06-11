import pool from "../db";

export const getAllPatients = async () => {
    const [rows] = await pool.query(
        "SELECT * FROM patients"
    );

    return rows;
};

export const getPatientById = async (id: number) => {
    const [rows] = await pool.query(
        "SELECT * FROM patients WHERE id = ?",
        [id]
    );

    return rows;
};

export const createPatient = async (
    name: string,
    age: number,
    phone: string
) => {
    const [result] = await pool.query(
        `INSERT INTO patients(name, age, phone)
         VALUES (?, ?, ?)`,
        [name, age, phone]
    );

    return result;
};

export const deletePatient = async (id: number) => {
    const [result] = await pool.query(
        "DELETE FROM patients WHERE id = ?",
        [id]
    );

    return result;
};