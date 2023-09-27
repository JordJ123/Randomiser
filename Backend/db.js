const oracledb = require("oracledb");

const AND = " AND ";

class OracleDatabase {

    constructor() {}

    async connect() {
        this.connection = await oracledb.getConnection()
    }

    async query(querySQL, bind, errorMessage) {
        try {
            let results = await this.connection.execute(
                querySQL, bind, { autoCommit: true });
            console.log(querySQL);
            console.log(bind);
            return results;
        } catch (error) {
            console.log('\x1b[31m' + querySQL)
            console.log(bind)
            console.log(errorMessage + "\n" + error.message + '\x1b[0m');
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
        let sequence = `CREATE SEQUENCE ${name}_autoincrement\n` +
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
        let uniqueAttributes = []
        attributes.forEach((attribute, index) => {
            statement += `${attribute.name}, `;
            if (attribute.isUnique) {
                uniqueAttributes.push(index)
            }
        })
        statement = statement.substring(0, statement.length - 2) + ") VALUES ("
        attributeValues.forEach((attributeValue) => {
            statement += `${attributeValue}, `;
        })
        statement = statement.substring(0, statement.length - 2)
            + ")\n SELECT 1 FROM DUAL";
        if (uniqueAttributes.length > 0) {
            statement += `\nWHERE NOT EXISTS (\nSELECT 1 FROM ${table}\nWHERE`;
            uniqueAttributes.forEach((uniqueAttribute) => {
                statement += `\n   ${attributes[uniqueAttribute].name} = ` +
                    `${attributeValues[uniqueAttribute]} AND `
            });
            statement = statement.substring(0, statement.length - 5) + "\n)"
        }
        await this.query(statement, {}, `Can't add entity to ${table} table`)
    }

    async insertAll(table, attributes, attributeValuesList, bind) {
        let isUniqueAttributes = false
        attributes.every((attribute) => {
            if (attribute.isUnique) {
                isUniqueAttributes = true;
                return false
            }
            return true
        })
        if (isUniqueAttributes) {
            for (const attributeValues of attributeValuesList) {
                await this.insert(table, attributes, attributeValues)
            }
        } else {
            let statement = 'INSERT ALL\n'
            let intoStatement = `INTO ${table} (`
            attributes.forEach((attribute) => {
                intoStatement += `${attribute.name}, `;
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
    }

    async select(table, selectAttributes, whereStatements, orderByStatement) {
        let statement = "SELECT ";
        selectAttributes.forEach((value) => {
            statement += `${table}.${value.name}, `
        });
        statement = statement.substring(0, statement.length - 2) +
            `\nFROM ${table}`;
        if (whereStatements != null && whereStatements.length > 0) {
            statement += "\n" + WhereStatement.toMultipleString(
                whereStatements);
        }
        if (orderByStatement != null) {
            statement += "\n" + orderByStatement.toString();
        }
        const results = await this.query(statement, {},
            `Can't find attributes in ${table} table`)
        if (results.rows.length > 0) {
            return results.rows;
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

class WhereStatement {

    constructor(attribute, value) {
        this.attribute = attribute;
        this.value = value;
    }

    static toMultipleString(whereStatements) {
        let fullStatement = "WHERE ";
        whereStatements.forEach((whereStatement) => {
            fullStatement += whereStatement.toString().replace("WHERE ", "")
                + AND;
        })
        return fullStatement.substring(0, fullStatement.length - AND.length);
    }

    toString() {
        return `WHERE ${this.attribute.name} = ${this.value}`;
    }

}

class OrderByStatement {

    constructor(attribute, isAscending) {
        this.attribute = attribute;
        this.isAscending = isAscending;
    }

    toString() {
        let orderBy = "";
        if (this.isAscending) {
            orderBy = "ASC";
        } else {
            orderBy = "DESC";
        }
        return `ORDER BY ${this.attribute.name} ${orderBy}`;
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
    OracleDatabase,
    OrderByStatement,
    WhereStatement,
    Attribute
};