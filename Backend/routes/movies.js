const express = require('express');
const {OracleDatabase, Attribute, OrderByStatement} = require("../db");
const router = express.Router();

//CONSTANTS
const MOVIE_ATTRIBUTES = new Map([
    ['title', new Attribute("title", "VARCHAR(255)", true, true)],
]);

/**
 * Get Route - Base
 * Gets all movies
 * @param {Request} req Request sent by client
 * @param {Response} res Response to be sent
 * @return {Object[]} All movies
 */
router.get('', async function (req, res) {
    try {
        return res.json(await getMovies(req.query['category']));
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }
})

/**
 * Gets all movies
 * @param {String} category Name of category to get movies from (null if all)
 * @return {Promise<*[]>} All movies from the requested category (all if null)
*/
async function getMovies(category) {
    let db = new OracleDatabase();
    try {
        await db.connect();
        let results;
        if (category) {
            const query =
                `SELECT movies.title\n` +
                `FROM movies\n` +
                `JOIN movie_category on movie_category.movie_id = movies.id\n` +
                `JOIN categories on movie_category.category_id = categories.id\n` +
                `WHERE categories.url = \'${category}\'\n` +
                `ORDER BY movies.title ASC`
            results = (await db.query(query, {},
                "Can't get tv movie data from database")).rows
        } else {
            results = await db.select("movies", MOVIE_ATTRIBUTES, null,
                new OrderByStatement(MOVIE_ATTRIBUTES.get('title'), true))
        }
        const movies = [];
        for (const record of results) {
            movies.push({
                title: record[0],
            })
        }
        return movies;
    } finally {
        db.disconnect();
    }
}

module.exports = {
    MOVIE_ATTRIBUTES,
    router,
    getMovies
};
