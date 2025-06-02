require("dotenv").config();
const express = require("express");
const router = require("./routes/api");
const connection = require("./config/database");

const app = express();
const port = process.env.PORT || 3001;

//config req.body
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data

app.use("/api/", router);

(async () => {
  try {
    await connection();

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log(">>> Error connect to DB: ", error);
  }
})();
