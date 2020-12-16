const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./Routes/auth");
const dotenv = require("dotenv");

const app = express();

//getting ENV Variables
dotenv.config();

//connecting DB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("DB Connected Successfully")
);

//Roue Middelware
app.use(express.json()); //TO PHARSE REQ BODY DAYA INTO JSON
app.use("/api/user", authRoute);

app.listen(3005, () => console.log("Server Running"));
