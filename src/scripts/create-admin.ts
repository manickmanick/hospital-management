import dotenv from "dotenv";
import pool from "../db";
import { createUser } from "../services/auth.service";

dotenv.config();

const main = async () => {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error(
      "Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD before creating admin",
    );
  }

  const result = await createUser({ name, email, password, role: "ADMIN" });
  console.log(`Admin created with id ${result.id}`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
