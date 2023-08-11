const express = require('express');
const axios = require('axios');
const oracledb = require('oracledb');
const {Error} = require("http-errors");
const db = require('../db.js')
const router = express.Router();

/* GET ROUTES */
router.get('/fortnite', async function (req, res) {
    try {
        await db.connect();
        let gameId = await findGameId();
        if (gameId === -1) {
            await addGame();
            gameId = await findGameId();
        }
        await deleteLocations()
        await addLocations(gameId)
        return res.json("Success")
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    } finally {
        db.disconnect();
    }
});

async function findGameId() {
    const query = 'SELECT games.id FROM games WHERE games.url = \'fortnite\''
    const results = await db.query(query, {}, "Can't find game id in database")
    if (results.rows.length > 0) {
        return results.rows[0][0]
    } else {
        return -1;
    }
}

async function addGame() {
    let query =
        'INSERT ALL\n' +
        'INTO games (title, url) VALUES (\'Fortnite\', \'fortnite\')\n' +
        'SELECT 1 FROM DUAL'
    await db.query(query, {}, "Can't add game to database")
}

async function deleteLocations() {
    const query =
        'DELETE\n' +
        'FROM locations\n' +
        'WHERE locations.game_id in (\n' +
        '   SELECT ID FROM games WHERE games.url = \'fortnite\')'
    await db.query(query, {}, "Can't delete locations from database")
}

async function addLocations(gameId) {
    const response = await axios.get("https://fortnite-api.com/v1/map");
    let query = 'INSERT ALL\n'
    let names = {};
    response.data.data.pois.forEach(function (poi, index) {
        let isNamed;
        if (!(poi.id.includes("UnNamed"))) {
            isNamed = 1;
        } else {
            isNamed = 0;
        }
        names[`${index}`] = poi.name
        query +=
            `INTO locations (name, x, y, z, is_named, game_id) VALUES ` +
            `(:${index}, ${poi.location.x}, ${poi.location.y}, ` +
            `${poi.location.z}, ${isNamed}, ${gameId})\n`
    });
    query += "SELECT * FROM DUAL"
    await db.query(query, names, "Can't add locations to database")
}

module.exports = router;
