const oracledb = require("oracledb");

let connection = {};

async function connect() {
    connection = await oracledb.getConnection();
}

async function query(querySQL, bind, errorMessage) {
    try {
        return await connection.execute(querySQL, bind, { autoCommit: true });
    } catch (error) {
        console.log(errorMessage + "\n" + querySQL + "\n" + error)
        throw new Error();
    }
}

function disconnect() {
    connection.release();
}

module.exports = {
    connect,
    query,
    disconnect
};