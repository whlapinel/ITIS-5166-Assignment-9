import express from 'express';
import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
});

console.log(process.env.DB_HOST);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/budget', (req, res) => {
    connection.connect();
    connection.query('SELECT * FROM budget', (error, results) => {
        if (error) {
            throw error;
        }
        res.send(results);
    });
    connection.end();
});




