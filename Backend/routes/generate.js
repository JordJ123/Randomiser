require('../db.js');
require('oracledb');

const express = require('express');
const axios = require('axios');
const path = require("path");
const fs = require("fs");
const {DatabaseConnection} = require("../db");
const router = express.Router();

/* GET ROUTES */
router.get('/fortnite', async function (req, res) {
    let db = new DatabaseConnection();
    try {
        await db.connect();
        let gameId = await db.select("games", "id", "url", "\'fortnite\'");
        if (gameId === -1) {
            await db.insert("games", ["title", "url"],
                ["\'Fortnite\'", "\'fortnite\'"])
            gameId = await db.select("games", "id", "url", "\'fortnite\'");
        }
        await db.delete("locations",
            "WHERE locations.game_id in (\n" +
            "   SELECT ID FROM games WHERE games.url = \'fortnite\')")
        await addFortniteLocations(db, gameId)
        await addFortniteMap(db)
        return res.json("Success")
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    } finally {
        db.disconnect();
    }
});

router.get('/movies', async function (req, res) {
    // let db = new DatabaseConnection();
    try {
        // await db.connect();
        const directory = "../Database/Movies";
        fs.readdir(directory, 'utf8', (err, files) => {
            if (!err) {
                files.forEach((file) => {
                    const filePath = path.join(directory, file);
                    console.log(file)
                    fs.readFile(filePath, 'utf8', (err, data) => {
                        if (!err) {
                            console.log(data)
                        } else {
                            console.error('Error reading the file:', err);
                        }
                    })
                });
                return res.json("Success")
            } else {
                console.error('Error reading the directory:', err);
            }
        });
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    } finally {
        // db.disconnect();
    }
});

async function addFortniteLocations(db, gameId) {
    const response = await axios.get("https://fortnite-api.com/v1/map");
    let attributeValuesList = [];
    let names = {};
    response.data.data.pois.forEach(function (poi, index) {
        let isNamed;
        if (!(poi.id.includes("UnNamed"))) {
            isNamed = 1;
        } else {
            isNamed = 0;
        }
        attributeValuesList.push([":"+index, poi.location.x, poi.location.y,
            poi.location.z, isNamed, gameId])
        names[`${index}`] = poi.name
    });
    await db.insertAll("locations",
        ["name", "x", "y", "z", "is_named", "game_id"],
        attributeValuesList, names)
}

async function addFortniteMap() {
    const response = await axios.get(
        "https://fortnite-api.com/images/map_en.png",
        { responseType: 'arraybuffer' });
    const imagePath = path.join(__dirname, '..', 'public', 'images', 'maps',
        'fortnite.jpg');
    fs.writeFileSync(imagePath, response.data);
}

module.exports = router;
