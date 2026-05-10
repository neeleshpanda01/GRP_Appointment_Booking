const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/hospital");

app.use("/api", require("./routes"));
app.listen(5000, () => console.log("Server running on 5000"));
const temp = 1;