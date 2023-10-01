const express = require('express');
const {OracleDatabase, Attribute, OrderByStatement} = require("../db");
const router = express.Router();

//CONSTANTS
const GAME_ATTRIBUTES = new Map([
    ['title', new Attribute("title", "VARCHAR(255)", true, true)],
    ['url', new Attribute("url", "VARCHAR(255)", true, true)],
]);

/**
 * Get Route - Base.
 * Gets all games.
 * @param {Request} req Request sent by client
 * @param {Response} res Response to be sent
 * @return {Object[]} All games
 */
router.get('', async function(req, res) {
    let db = new OracleDatabase();
    try {
        await db.connect();
        const results = await db.select("games", GAME_ATTRIBUTES, null,
            new OrderByStatement(GAME_ATTRIBUTES.get('title'), true))
        let games = []
        for (const row of results) {
            games.push({
                'title': row[0],
                'url': row[1]
            })
        }
        return res.json(games)
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    } finally {
        db.disconnect();
    }
});

/**
 * Get Route - /{game}.
 * Gets details for the request game.
 * @param {Request} req Request sent by client
 * @param {Response} res Response to be sent
 * @return {Object} Requested game details
 */
router.get('/:game', async function (req, res) {
    let db = new OracleDatabase();
    try {
        await db.connect();
        const query =
            `SELECT games.title, locations.name, locations.x, locations.y, ` +
                `locations.z, locations.is_named\n` +
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

module.exports = {
    router,
    GAME_ATTRIBUTES
};
