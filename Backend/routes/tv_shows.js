const express = require('express');
const {OracleDatabase} = require("../db");
const router = express.Router();

/* GET ROUTES */
router.get('', async function (req, res) {
    try {
        return res.json(await getTVShows(req.query['category']));
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }
})

async function getTVShows(category) {
    let db = new OracleDatabase();
    try {
        await db.connect();
        const query =
            `SELECT tv_shows.title, tv_shows.season, ` +
                `tv_shows.episode_number, tv_shows.episode_name\n` +
            `FROM tv_shows\n` +
            `JOIN tv_show_category on tv_show_category.tv_show_id ` +
                `= tv_shows.id\n` +
            `JOIN categories on tv_show_category.category_id ` +
                `= categories.id\n` +
            `WHERE categories.url = \'${category}\'`
        const results = await db.query(query, {},
            "Can't get tv show data from database")
        const tv_shows = [];
        for (const records of results.rows) {
            tv_shows.push({
                title: records[0],
                season: records[1],
                episode_number: records[2],
                episode_name: records[3],
            })
        }
        return tv_shows;
    } finally {
        db.disconnect();
    }
}

module.exports = {
    router,
    getTVShows
};
