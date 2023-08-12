const oracledb = require("oracledb");

class DatabaseConnection {

    constructor() {}

    async connect() {
        this.connection = await oracledb.getConnection()
    }

    async query(querySQL, bind, errorMessage) {
        try {
            return await this.connection.execute(
                querySQL, bind, { autoCommit: true });
        } catch (error) {
            console.log(errorMessage + "\n" + querySQL + "\n" + error)
            throw new Error();
        }
    }

    disconnect() {
        this.connection.close();
    }
}


module.exports = {
    DatabaseConnection
};