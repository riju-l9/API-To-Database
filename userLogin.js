require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

// Register endpoint
app.post('/user/register', async (req, res) => {
    const { userName, password, email, name } = req.body;

    if (!userName || !password || !email || !name) {
        return res.status(400).json({
            message: 'Please provide all required fields: userName, password, email, and name.'
        });
    }

    try {
        const existingUser = await pool.query(
            'SELECT user_name FROM newusers WHERE user_name = $1 OR email = $2',
            [userName, email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: 'User with this username or email already exists.'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);

        const result = await pool.query(
            'INSERT INTO newusers (user_name, password, email, name) VALUES ($1, $2, $3, $4) RETURNING user_name, email',
            [userName, secPass, email, name]
        );

        if (result.rowCount === 0) {
            return res.status(500).json({ message: 'Registration failed.' });
        }

        return res.status(201).json({
            message: 'Registration successful.',
            user: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

// Login endpoint
app.post('/user/login', async (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        return res.status(400).json({
            message: 'Both userName and password are required.'
        });
    }

    try {
        const { rows } = await pool.query(
            'SELECT * FROM newusers WHERE user_name = $1',
            [userName]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        delete user.password;
        return res.status(200).json({
            message: 'Login successful!',
            user
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
