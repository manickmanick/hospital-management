import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index"

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api", routes);

app.listen(Number(process.env.PORT), () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
