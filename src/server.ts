import express from "express";
import dotenv from "dotenv";

import patientRoutes from "./routes/patient.routes";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/patients", patientRoutes);

app.listen(Number(process.env.PORT), () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
