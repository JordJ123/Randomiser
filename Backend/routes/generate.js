//IMPORTS
require('../db.js');
require('oracledb');
const express = require('express');
const axios = require('axios');
const path = require("path");
const fs = require("fs");
const {OracleDatabase, Attribute, WhereStatement} = require("../db");
const router = express.Router();

//CONSTANTS
const categoryAttributes = [
    new Attribute("name", "VARCHAR(255)", true, true),
    new Attribute("url", "VARCHAR(255)", true, true)
];
const movieAttributes = [new Attribute("title", "VARCHAR(255)", true, true)];
const tvShowAttributes = [
    new Attribute("title", "VARCHAR(255)", true, false),
    new Attribute("season", "NUMBER", true, false),
    new Attribute("episode_number", "NUMBER", true, false),
    new Attribute("episode_name", "VARCHAR(255)", true, false),
];
const movieCategoryAttributes = [
    new Attribute("movie_id", "NUMBER", true, true),
    new Attribute("category_id", "NUMBER", true, true)
]
const tvShowCategoryAttributes = [
    new Attribute("tv_show_id", "NUMBER", true, true),
    new Attribute("category_id", "NUMBER", true, true)
]

//GET ROUTES
router.get('/fortnite', async function (req, res) {
    let db = new OracleDatabase();
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
    const directoryPath = "../Database/Data";
    try {
        fs.readdir(directoryPath, (err, files) => {
            if (!err) {
                files.forEach((file) => {
                    const filePath = path.join(directoryPath, file);
                    fs.readFile(filePath, 'utf8', async (err, data) => {
                        if (!err) {
                            let db = new OracleDatabase();
                            await db.connect();
                            try {
                                await addCategory(db, file);
                                let movies = await addMovies(db, data);
                                await addMoviesToCategory(db, file, movies);
                                return res.json("Success")
                            } catch (error) {
                                throw error;
                            } finally {
                                db.disconnect();
                            }
                        } else {
                            console.error('Error reading the file:', err);
                        }
                    });
                });
            } else {
                throw Error();
            }
        });

    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }
});

router.get('/tv_shows', async function (req, res) {
    const directoryPath = "../Database/Data/TV";
    try {
        fs.readdir(directoryPath, (err, files) => {
            if (!err) {
                files.forEach((file) => {
                    const filePath = path.join(directoryPath, file);
                    fs.readFile(filePath, 'utf8', async (err, data) => {
                        if (!err) {
                            let db = new OracleDatabase();
                            await db.connect();
                            try {
                                await addCategory(db, file);
                                let tvShows = await addTVShows(db, data);
                                await addTVShowsToCategory(db, file, tvShows);
                                return res.json("Success!")
                            } catch (error) {
                                throw error;
                            } finally {
                                db.disconnect();
                            }
                        } else {
                            console.error('Error reading the file:', err);
                        }
                    });
                });
            } else {
                throw Error();
            }
        });

    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
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
    await db.insertAll("locations", [
            new Attribute("name", "VARCHAR(255)", true, false),
            new Attribute("x", "Number", false, false),
            new Attribute("y", "Number", false, false),
            new Attribute("z", "Number", false, false),
            new Attribute("is_named", "Number", true, false),
            new Attribute("game_id", "Number", true, false)
        ], attributeValuesList, names)
}

async function addFortniteMap() {
    const response = await axios.get(
        "https://fortnite-api.com/images/map_en.png",
        { responseType: 'arraybuffer' });
    const imagePath = path.join(__dirname, '..', 'public', 'images', 'maps',
        'fortnite.jpg');
    fs.writeFileSync(imagePath, response.data);
}

async function addCategory(db, file) {
    await db.createTable("categories", categoryAttributes)
    let attributeValuesList = [
        `\'${file}\'`, `\'${file.toLowerCase().replace(/\s/g, "")}\'`];
    await db.insert("categories", categoryAttributes,
        attributeValuesList)
}

async function addMovies(db, data) {
    await db.createTable("movies", movieAttributes);
    let attributeValuesList = []
    data.split(/\r?\n/).forEach((movie) => {
        attributeValuesList.push(["'" + movie + "'"])
    })
    await db.insertAll("movies", movieAttributes, attributeValuesList, {})
    return attributeValuesList;
}

async function addMoviesToCategory(db, category, movies) {
    let attributeValuesList = []
    let category_id = await db.select("movie_categories", "id", "name",
        `\'${category}\'`)
    for (const movie of movies) {
        attributeValuesList.push([
            await db.select("movies", "id", "title", movie[0]), category_id]);
    }
    await db.insertAll("movie_movie_category", movieCategoryAttributes,
        attributeValuesList, {});
}

async function addTVShows(db, data) {
    await db.createTable("tv_shows", tvShowAttributes);
    let attributeValuesList = []
    data.split(/\r?\n/).forEach((tvShow) => {
        let tvShowData = tvShow.split(",");
        attributeValuesList.push([`\'${tvShowData[0]}\'`, tvShowData[1],
            tvShowData[2], `\'${tvShowData[3]}\'`])
    })
    await db.insertAll("tv_shows", tvShowAttributes, attributeValuesList, {})
    return attributeValuesList;
}

async function addTVShowsToCategory(db, category, tv_shows) {
    let whereStatements = [
        new WhereStatement(tvShowAttributes[0], ""),
        new WhereStatement(tvShowAttributes[1], ""),
        new WhereStatement(tvShowAttributes[2], "")
    ];
    let attributeValuesList = []
    let categoryWhere = new WhereStatement(categoryAttributes[0],
        `\'${category}\'`);
    let category_id = await db.select("categories", "id", [categoryWhere])
    for (const tv_show of tv_shows) {
        whereStatements[0].value = tv_show[0];
        whereStatements[1].value = tv_show[1];
        whereStatements[2].value = tv_show[2];
        attributeValuesList.push([
            await db.select("tv_shows", "id", whereStatements), category_id]);
    }
    await db.insertAll("tv_show_category", tvShowCategoryAttributes,
        attributeValuesList, {});
}

module.exports = router;
