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
            console.log(errorMessage + "\n" + error.message)
            throw new Error(error.message);
        } finally {
            console.log("")
        }
    }

    async createTable(name, attributes) {
        await this._createTable(name, attributes);
        await this._createSequence(name);
        await this._createTrigger(name);
    }

    async _createTable(name, attributes) {
        let create = `CREATE TABLE ${name} (\n` +
            `   id NUMBER NOT NULL,\n`;
        attributes.forEach((attribute) => {
            create += `    ${attribute.name} ${attribute.type}`
            if (attribute.isNotNull) {
                create += ' NOT NULL'
            }
            if (attribute.isUnique) {
                create += ' UNIQUE'
            }
            create += ',\n'
        });
        create = create.substring(0, create.length - 2) + `\n)`;

        try {
            await this.query(create, {}, `Can't create ${name} table`)
        } catch (error) {
            if (error.message !== "ORA-00955: name is already used by an existing object") {
                throw new Error(error.message)
            }
        }
    }

    async _createSequence(name) {
        let sequence = `CREATE SEQUENCE MOVIES_AUTOINCREMENT\n` +
            `START WITH 1\n` +
            `INCREMENT BY 1\n` +
            `NOCACHE\n` +
            `NOCYCLE`;
        try {
            await this.query(sequence, {},
                `Can't create ${name} table sequence`)
        } catch (error) {
            if (error.message !== "ORA-00955: name is already used by an existing object") {
                throw new Error(error.message)
            }
        }
    }

    async _createTrigger(name) {
        let trigger =
            `CREATE OR REPLACE NONEDITIONABLE TRIGGER ${name}_trigger\n` +
            `BEFORE INSERT ON ${name}\n` +
            `FOR EACH ROW\n` +
            `BEGIN\n` +
            `   SELECT ${name}_autoincrement.NEXTVAL\n` +
            `   INTO :NEW.id\n` +
            `   FROM dual;\n` +
            `END;`;
        try {
            await this.query(trigger, {}, `Can't create ${name} table trigger`);
        } catch (error) {
            if (error.message !== "ORA-00955: name is already used by an existing object") {
                throw new Error(error.message)
            }
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
        let intoStatement = `INTO ${table} (`
        let uniqueAttributes = []
        attributes.forEach((attribute) => {
            intoStatement += `${attribute.name}, `;
            if (attribute.isUnique) {
                uniqueAttributes.push(attribute);
            }
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
        if (uniqueAttributes.length > 0) {
            let isFirst = true;
            attributeValuesList.forEach((attributeValues) => {
                if (isFirst) {
                    statement += "\nWHERE NOT EXISTS (SELECT 1 FROM movies " +
                        `WHERE name = ${attributeValues[0]})`
                    isFirst = false;
                } else {
                    statement += "\nAND NOT EXISTS (SELECT 1 FROM movies " +
                        `WHERE name = ${attributeValues[0]})`
                }
            })
        }
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

class Attribute {
    constructor(name, type, isNotNull, isUnique) {
        this.name = name;
        this.type = type;
        this.isNotNull = isNotNull;
        this.isUnique = isUnique;
    }
}

module.exports = {
    DatabaseConnection,
    Attribute
};