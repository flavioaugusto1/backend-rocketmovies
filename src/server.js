require("dotenv/config");
require("express-async-errors");

const migrationsRun = require("./database/sqlite/migrations");
const express = require("express");
const route = require("./routes/index");
const AppError = require("./utils/AppError");
const uploadConfig = require("./configs/upload");
const cors = require("cors");

const app = express();
app.use(cors());
migrationsRun();

app.use(express.json());
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));
app.use(route);

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

const port = 3000;
app.listen(port, console.log("Server is running"));
