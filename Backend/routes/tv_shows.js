const express = require('express');
const {OracleDatabase, Attribute, OrderByStatement} = require("../db");
const router = express.Router();

//CONSTANTS
const TV_SHOW_ATTRIBUTES = new Map([
    ['title', new Attribute("title", "VARCHAR(255)", true, false)],
    ['season', new Attribute("season", "NUMBER", true, false)],
    ['episode_number', new Attribute("episode_number", "NUMBER", true, false)],
    ['episode_name', new Attribute("episode_name", "VARCHAR(255)", true,
        false)],
]);

/**
 * Get Route - Base
 * Gets all tv shows
 * @param {Request} req Request sent by client
 * @param {Response} res Response to be sent
 * @return {Object[]} All tv shows
 */
router.get('', async function (req, res) {
    try {
        return res.json(await getTVShows(req.query['category']));
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }
})

/**
 * Gets all tv shows
 * @param {String} category Name of category to get tv shows from (null if all)
 * @return {Promise<*[]>}  All tv shows from requested category (all if null)
 */
async function getTVShows(category) {
    let db = new OracleDatabase();
    try {
        await db.connect();
        let results;
        if (category) {
            const query =
                `SELECT tv_shows.title, tv_shows.season, ` +
                `tv_shows.episode_number, tv_shows.episode_name\n` +
                `FROM tv_shows\n` +
                `JOIN tv_show_category on tv_show_category.tv_show_id ` +
                `= tv_shows.id\n` +
                `JOIN categories on tv_show_category.category_id ` +
                `= categories.id\n` +
                `WHERE categories.url = \'${category}\'\n` +
                `ORDER BY tv_shows.title ASC`
            results = (await db.query(query, {},
                "Can't get tv show data from database")).rows
        } else {
            results = await db.select("tv_shows", TV_SHOW_ATTRIBUTES, null,
                new OrderByStatement(TV_SHOW_ATTRIBUTES.get('title'), true))
        }
        const tv_shows = [];
        for (const record of results) {
            tv_shows.push({
                title: record[0],
                season: record[1],
                episode_number: record[2],
                episode_name: record[3],
            })
        }
        return tv_shows;
    } finally {
        db.disconnect();
    }
}

module.exports = {
    TV_SHOW_ATTRIBUTES,
    router,
    getTVShows
};
