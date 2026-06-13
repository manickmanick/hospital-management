import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../db";
import { AppError } from "../utils/app-error";

type UserRow = RowDataPacket & {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: "ADMIN" | "DOCTOR" | "LAB";
  doctor_id: number | null;
  is_active: number;
};

export const login = async (email: string, password: string) => {
  const [rows] = await pool.query<UserRow[]>(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email],
  );
  const user = rows[0];

  if (
    !user ||
    !user.is_active ||
    !(await bcrypt.compare(password, user.password_hash))
  ) {
    throw new AppError(401, "Invalid email or password");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AppError(500, "JWT_SECRET is not configured");

  const token = jwt.sign(
    {
      email: user.email,
      role: user.role,
      doctorId: user.doctor_id,
    },
    secret,
    {
      subject: String(user.id),
      expiresIn: "8h",
    },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      doctorId: user.doctor_id,
    },
  };
};

export const createUser = async (input: {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "DOCTOR" | "LAB";
  doctorId?: number | null;
}) => {
  const passwordHash = await bcrypt.hash(input.password, 12);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO users (name, email, password_hash, role, doctor_id)
       VALUES (?, ?, ?, ?, ?)`,
      [
        input.name,
        input.email,
        passwordHash,
        input.role,
        input.doctorId || null,
      ],
    );
    return { id: result.insertId };
  } catch (error: any) {
    if (error?.code === "ER_DUP_ENTRY") {
      throw new AppError(409, "Email or doctor account already exists");
    }
    throw error;
  }
};

export const getUsers = async () => {
  const [rows] = await pool.query(
    `SELECT id, name, email, role, doctor_id AS doctorId, is_active AS isActive,
            created_at AS createdAt
     FROM users ORDER BY id DESC`,
  );
  return rows;
};

export const deleteUser = async (id: number, currentUserId: number) => {
  if (id === currentUserId) {
    throw new AppError(400, "You cannot delete your own account");
  }
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM users WHERE id = ?",
    [id],
  );
  if (!result.affectedRows) throw new AppError(404, "User not found");
};
