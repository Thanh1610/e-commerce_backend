require('dotenv').config();
const express = require('express');
const connection = require('./config/database');
const routes = require('./routes/index');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3001;

app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    }),
);
app.use(cookieParser());

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
