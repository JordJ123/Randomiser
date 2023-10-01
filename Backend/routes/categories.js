const express = require('express');
const {OracleDatabase, Attribute, OrderByStatement, WhereStatement} = require("../db");
const {getMovies} = require("./movies");
const {getTVShows} = require("./tv_shows");
const router = express.Router();

//CONSTANTS
const CATEGORY_ATTRIBUTES = new Map([
    ['name', new Attribute("name", "VARCHAR(255)", true, true)],
    ['url', new Attribute("url", "VARCHAR(255)", true, true)],
]);

/**
 * Get Route - Base.
 * Gets all the categories.
 * @param {Request} req Request sent by client
 * @param {Response} res Response to be sent
 * @return {Object[]} All categories
 */
router.get('', async function(req, res) {
    try {
        let db = new OracleDatabase();
        try {
            await db.connect();
            let results = await db.select("categories", CATEGORY_ATTRIBUTES,
                null, new OrderByStatement(CATEGORY_ATTRIBUTES.get('name'),
                    true));
            let categories = []
            for (const record of results) {
                categories.push({
                    'name': record[0],
                    'url': record[1]
                })
            }
            return res.json(categories);
        } finally {
            db.disconnect();
        }
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }
});

/**
 * Get Route - /{category}.
 * Gets the details of the request category.
 * @param {Request} req Request sent by client
 * @param {Response} res Response to be sent
 * @return {Object} Requested category details
 */
router.get('/:category', async function(req, res) {
    let category = req.params['category'];
    let db = new OracleDatabase();
    try {
        await db.connect();
        let name = (await db.select("categories",
            [CATEGORY_ATTRIBUTES.get('name')],
            [new WhereStatement(CATEGORY_ATTRIBUTES.get('url'),
                `\'${category}\'`)], null))[0][0]
        let movies = await getMovies(category);
        let tvShows = await getTVShows(category);
        return res.json({
            name: name,
            movies: movies,
            tvShows: tvShows,
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
    CATEGORY_ATTRIBUTES
};
