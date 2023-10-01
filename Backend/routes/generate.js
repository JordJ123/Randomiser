require('../db.js');
require('oracledb');
const express = require('express');
const axios = require('axios');
const path = require("path");
const fs = require("fs");
const {OracleDatabase, Attribute, WhereStatement} = require("../db");
const {GAME_ATTRIBUTES} = require("./games");
const {CATEGORY_ATTRIBUTES} = require("./categories");
const {MOVIE_ATTRIBUTES} = require("./movies");
const {TV_SHOW_ATTRIBUTES} = require("./tv_shows");
const router = express.Router();

//CONSTANTS
const idAttribute = new Attribute("id", "NUMBER", true, true);
const movieCategoryAttributes = [
    new Attribute("movie_id", "NUMBER", true, true),
    new Attribute("category_id", "NUMBER", true, true)
]
const tvShowCategoryAttributes = [
    new Attribute("tv_show_id", "NUMBER", true, true),
    new Attribute("category_id", "NUMBER", true, true)
]

/**
 * Get Route - /games/fortnite
 * Generates data for fortnite.
 * @param {Request} req Request sent by client
 * @param {Response} res Response to be sent
 * @return {String} Status message
 */
router.get('/games/fortnite', async function (req, res) {
    let db = new OracleDatabase();
    try {
        await db.connect();
        let gameId = await getFortniteId(db);
        if (gameId === -1) {
            await db.insert("games", GAME_ATTRIBUTES,
                ["\'Fortnite\'", "\'fortnite\'"])
            gameId = await getFortniteId(db);
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

/**
 * Get Route - /movies
 * Generates data for movies.
 * @param {Request} req Request sent by client
 * @param {Response} res Response to be sent
 * @return {String} Status message
 */
router.get('/movies', async function (req, res) {
    const directoryPath = "../Database/Data/Movies";
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

/**
 * Get Route - /tv_shows
 * Generates data for tv shows.
 * @param {Request} req Request sent by client
 * @param {Response} res Response to be sent
 * @return {String} Status message
 */
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

/**
 * Gets the id of the fortnite game
 * @param {OracleDatabase} db Database
 * @return {Promise<*>} Fortnite id
 */
async function getFortniteId(db) {
    return db.select("games", [idAttribute],
        [new WhereStatement(GAME_ATTRIBUTES.get('url'),"\'fortnite\'")], null);
}

/**
 * Adds the fortnite location data
 * @param {OracleDatabase} db Database
 * @param {Number} gameId Id of fortnite
 */
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

/**
 * Adds the fortnite map image.
 */
async function addFortniteMap() {
    const response = await axios.get(
        "https://fortnite-api.com/images/map_en.png",
        { responseType: 'arraybuffer' });
    const imagePath = path.join(__dirname, '..', 'public', 'images', 'maps',
        'fortnite.jpg');
    fs.writeFileSync(imagePath, response.data);
}

/**
 * Adds the category to the category table
 * @param {OracleDatabase} db Database
 * @param {String} category Category name
 */
async function addCategory(db, category) {
    await db.createTable("categories", CATEGORY_ATTRIBUTES)
    let attributeValuesList = [
        `\'${category}\'`, `\'${category.toLowerCase().replace(/\s/g, "")}\'`];
    await db.insert("categories", CATEGORY_ATTRIBUTES,
        attributeValuesList)
}

/**
 * Adds movies to the movie table
 * @param {OracleDatabase} db Database
 * @param {String} data Movie file data
 */
async function addMovies(db, data) {
    await db.createTable("movies", MOVIE_ATTRIBUTES);
    let attributeValuesList = []
    data.split(/\r?\n/).forEach((movie) => {
        attributeValuesList.push(["'" + movie + "'"])
    })
    await db.insertAll("movies", MOVIE_ATTRIBUTES, attributeValuesList, {})
    return attributeValuesList;
}

/**
 * Links movies to category
 * @param {OracleDatabase} db Database
 * @param {String} category Name of category to link movie to
 * @param {Object[]} movies Movies to link to category
 */
async function addMoviesToCategory(db, category, movies) {
    let attributeValuesList = []
    let category_id = await db.select("categories", [idAttribute],
        [new WhereStatement(CATEGORY_ATTRIBUTES.get('name'),
            `\'${category}\'`)], null)
    for (const movie of movies) {
        let movieId =  await db.select("movies", [idAttribute],
            [new WhereStatement(MOVIE_ATTRIBUTES.get('title'), movie[0])],
            null);
        attributeValuesList.push([movieId, category_id]);
    }
    await db.insertAll("movie_category", movieCategoryAttributes,
        attributeValuesList, {});
}

/**
 * Adds tv shows to the tv show table
 * @param {OracleDatabase} db Database
 * @param {String} data TV show file data
 */
async function addTVShows(db, data) {
    await db.createTable("tv_shows", TV_SHOW_ATTRIBUTES);
    let tvShowAttributes = new Map([
        ['title', new Attribute("title", "VARCHAR(255)", true, true)],
        ['season', new Attribute("season", "NUMBER", true, true)],
        ['episode_number', new Attribute("episode_number", "NUMBER", true,
            true)],
        ['episode_name', new Attribute("episode_name", "VARCHAR(255)", true,
            false)],
    ]);
    let attributeValuesList = []
    for (const tvShow of data.split(/\r?\n/)) {
        let tvShowData = tvShow.split(",");
        try {
            await db.insert("tv_shows", tvShowAttributes,
                [`\'${tvShowData[0]}\'`, tvShowData[1], tvShowData[2],
                    `\'${tvShowData[3]}\'`], {});
        } catch (Error) {}
        attributeValuesList.push([`\'${tvShowData[0]}\'`, tvShowData[1],
            tvShowData[2], `\'${tvShowData[3]}\'`])
    }
    return attributeValuesList;
}

/**
 * Links TV shows to category
 * @param {OracleDatabase} db Database
 * @param {String} category Name of category to link movie to
 * @param {Object[]} tv_shows TV shows to link to category
 */
async function addTVShowsToCategory(db, category, tv_shows) {
    let whereStatements = [
        new WhereStatement(TV_SHOW_ATTRIBUTES.get('title'), ""),
        new WhereStatement(TV_SHOW_ATTRIBUTES.get('season'), ""),
        new WhereStatement(TV_SHOW_ATTRIBUTES.get('episode_number'), "")
    ];
    let attributeValuesList = []
    let categoryWhere = new WhereStatement(CATEGORY_ATTRIBUTES.get('name'),
        `\'${category}\'`);
    let category_id = await db.select("categories", [idAttribute],
        [categoryWhere], null)
    for (const tv_show of tv_shows) {
        whereStatements[0].value = tv_show[0];
        whereStatements[1].value = tv_show[1];
        whereStatements[2].value = tv_show[2];
        let tvShowId =  await db.select("tv_shows", [idAttribute],
            whereStatements, null);
        attributeValuesList.push([tvShowId, category_id]);
    }
    await db.insertAll("tv_show_category", tvShowCategoryAttributes,
        attributeValuesList, {});
}

module.exports = router;
