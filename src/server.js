require('dotenv').config();
const express = require('express');
const connection = require('./config/database');
const routes = require('./routes/index');

const app = express();
const port = process.env.PORT || 3001;

//config req.body
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data
routes(app);

(async () => {
    try {
        await connection();

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    } catch (error) {
        console.log('>>> Error connect to DB: ', error);
    }
})();
