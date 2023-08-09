const express = require('express');
const axios = require('axios');
const oracledb = require('oracledb');
const router = express.Router();

/* GET ROUTES */
router.get('/fortnite', async function(req, res, next) {
    try {
        const response = await axios.get("https://fortnite-api.com/v1/map");
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from the external API' });
    }
});
router.get('/:game', function (req, res) {
    oracledb.getConnection(req.app.get('dbConfig'), (err, connection) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const query =
            `SELECT games.title, locations.name, locations.x, locations.y, locations.z, locations.is_named\n` +
            `FROM locations\n` +
            `JOIN games on locations.game_id = games.id\n` +
            `WHERE games.url = \'${req.params.game}\'`
        connection.execute(query, (err, result) => {
            connection.release();
            if (!err) {
                const locations = [];
                for (const row of result.rows) {
                    locations.push({
                        name: row[1],
                        x: row[2],
                        y: row[4],
                        z: row[5],
                        isNamed: row[5]
                    })
                }
                return res.json({
                    'title': result.rows[0][0],
                    'locations': locations
                });
            } else {
                console.error('Error executing query:', err);
                return res.sendStatus(500);
            }
        });
    });
})

module.exports = router;
