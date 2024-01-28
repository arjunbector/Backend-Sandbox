import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors());
app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import router from "./routes/user.routes.js";

//router declaration
app.use("/api/v1/users", router);

//http://localhost:8080/api/v1/users/register

export default app;
