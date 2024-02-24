import express from 'express';
import mysql from 'mysql';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();
const app = express();
const port = 3000;

async function encryptPassword(password) {
    let encryptedPassword = password;

    const salt = await bcrypt.genSalt(10);
    encryptedPassword = await bcrypt.hash(password, salt);

    console.log("encrypted password: ", encryptedPassword);
    return encryptedPassword;
}

function transformDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
}

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
});

console.log(process.env.DB_HOST);

app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/api/signup', async (req, res) => {

    const { username, password } = req.body;
    console.log("received in body:", username, password);

    const date = new Date();
    const user = {
        username,
        password: await encryptPassword(password),
        date: transformDate(date),
    };
    connection.connect();
    connection.query('INSERT INTO user VALUES ("", ?, ?, ?)', [user.username, user.password, user.date], (error, results) => {
        if (error) {
            throw error;
        }
        res.send(results);
    });
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




