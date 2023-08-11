const express = require('express');
const db = require("../db.js");
const router = express.Router();

/* GET ROUTES */
router.get('/:game', async function (req, res) {
    try {
        await db.connect();
        const query =
            `SELECT games.title, locations.name, locations.x, locations.y, locations.z, locations.is_named\n` +
            `FROM locations\n` +
            `JOIN games on locations.game_id = games.id\n` +
            `WHERE games.url = \'${req.params.game}\'`
        const results = await db.query(query, {},
            "Can't get location data from database")
        const locations = [];
        for (const row of results.rows) {
            locations.push({
                name: row[1],
                x: row[2],
                y: row[3],
                z: row[4],
                isNamed: row[5]
            })
        }
        return res.json({
            'title': results.rows[0][0],
            'locations': locations
        });
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    } finally {
        db.disconnect();
    }
})

module.exports = router;
