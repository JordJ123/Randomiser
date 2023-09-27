const express = require('express');
const {OracleDatabase} = require("../db");
const router = express.Router();

/* GET ROUTES */
router.get('', async function (req, res) {
    try {
        return res.json(await getMovies(req.query['category']));
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }
})

async function getMovies(category) {
    let db = new OracleDatabase();
    try {
        await db.connect();
        const query =
            `SELECT movies.title\n` +
            `FROM movies\n` +
            `JOIN movie_category on movie_category.movie_id = movies.id\n` +
            `JOIN categories on movie_category.category_id = categories.id\n` +
            `WHERE categories.url = \'${category}\'`
        const results = await db.query(query, {},
            "Can't get movie data from database")
        const movies = [];
        for (const row of results.rows) {
            movies.push({
                title: row[0],
            })
        }
        return movies;
    } finally {
        db.disconnect();
    }
}

module.exports = {
    router,
    getMovies
};
