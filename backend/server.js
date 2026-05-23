const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'weather_app',
    password: 'vanlrtiop90',
    port: 5432,
});

app.get('/api/favorites', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM favorite_cities ORDER BY added_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/favorites', async (req, res) => {
    const { city_name, country, temp_c } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO favorite_cities (city_name, country, temp_c) VALUES ($1, $2, $3) RETURNING *',
            [city_name, country, temp_c]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/favorites/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM favorite_cities WHERE id = $1', [id]);
        res.json({ message: 'Город удалён' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
