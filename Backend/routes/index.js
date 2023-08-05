var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET DATA. */
router.get('/fortnite', async function(req, res, next) {
    try {
        const response = await axios.get("https://fortnite-api.com/v1/map");
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from the external API' });
    }
});

module.exports = router;
