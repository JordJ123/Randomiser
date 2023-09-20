const express = require('express');
const {DatabaseConnection} = require("../db");
const router = express.Router();

/* GET ROUTES */
router.get('/', async function(req, res) {
    let db = new DatabaseConnection();
    try {
        await db.connect();
        const query =
            'SELECT name, url\n' +
            'FROM movie_categories\n' +
            'ORDER BY name ASC'
        const results = await db.query(query, {},
            "Can't get movie category data from the database")
        let movies = []
        for (const row of results.rows) {
            movies.push({
                'title': row[0],
                'url': row[1]
            })
        }
        return res.json(movies)
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    } finally {
        db.disconnect();
    }
});

router.get('/:category', async function (req, res) {
    let db = new DatabaseConnection();
    try {
        await db.connect();
        const query =
            `SELECT movie_categories.name, movies.title\n` +
            `FROM movies\n` +
            `JOIN movie_movie_category on movie_movie_category.movie_id ` +
                `= movies.id\n` +
            `JOIN movie_categories on movie_movie_category.movie_category_id ` +
                `= movie_categories.id\n` +
            `WHERE movie_categories.url = \'${req.params.category}\'`
        const results = await db.query(query, {},
            "Can't get movie data from database")
        const movies = [];
        for (const row of results.rows) {
            movies.push({
                title: row[1],
            })
        }
        return res.json({
            'name': results.rows[0][0],
            'movies': movies
        });
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    } finally {
        db.disconnect();
    }
})

module.exports = router;
