const oracledb = require("oracledb");
const axios = require("axios");

class DatabaseConnection {

    constructor() {}

    async connect() {
        this.connection = await oracledb.getConnection()
    }

    async query(querySQL, bind, errorMessage) {
        try {
            console.log(querySQL)
            console.log(bind)
            return await this.connection.execute(
                querySQL, bind, { autoCommit: true });
        } catch (error) {
            console.log(errorMessage + "\n" + error)
            throw new Error();
        } finally {
            console.log("")
        }
    }

    async insert(table, attributes, attributeValues) {
        let statement = `INSERT ALL INTO ${table} (`
        attributes.forEach((attribute) => {
            statement += `${attribute}, `;
        })
        statement = statement.substring(0, statement.length - 2) + ") VALUES ("
        attributeValues.forEach((attributeValue) => {
            statement += `${attributeValue}, `;
        })
        statement = statement.substring(0, statement.length - 2)
            + ") SELECT 1 FROM DUAL";
        await this.query(statement, {}, `Can't add entity to ${table} table`)
    }

    async insertAll(table, attributes, attributeValuesList, bind) {
        let statement = 'INSERT ALL\n'
        let intoStatement = 'INTO locations ('
        attributes.forEach((attribute) => {
            intoStatement += `${attribute}, `;
        })
        intoStatement = intoStatement.substring(0, intoStatement.length - 2)
            + ") VALUES ("
        attributeValuesList.forEach((attributeValues) => {
            statement += intoStatement;
            attributeValues.forEach((attributeValue) => {
                statement += `${attributeValue}, `;
            })
            statement = statement.substring(0, statement.length - 2) + ")\n";
        });
        statement += "SELECT * FROM DUAL"
        await this.query(statement, bind, `Can't add entities to ${table}`)
    }

    async select(table, selectAttribute, whereAttribute, whereValue) {
        const statement =
            `SELECT ${table}.${selectAttribute}\n` +
            `FROM ${table}\n` +
            `WHERE ${table}.${whereAttribute} = ${whereValue}`
        const results = await this.query(statement, {},
            `Can't find ${selectAttribute} in ${table} table`)
        if (results.rows.length > 0) {
            return results.rows[0][0]
        } else {
            return -1;
        }
    }

    async delete(table, whereStatement) {
        let query = `DELETE FROM ${table} `
        if (whereStatement != null) {
            query += whereStatement;
        }
        await this.query(query, {}, "Can't delete entities from database")
    }

    disconnect() {
        this.connection.close();
    }

}

module.exports = {
    DatabaseConnection
};