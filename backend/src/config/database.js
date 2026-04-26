import {Sequelize} from "sequelize"

const dialect = process.env.DB_DIALECT || "sqlite" ; 

let sequelize ; 

if (dialect === "sqlite") {

    // for local development - creates sqlite file in project root 

    sequelize = new Sequelize({
        dialect: 'sqlite', 
        storage: './database.sqlite', 
        logging: false 
    })
} else if (dialect === 'postgres'){

    // for render development - connection string 

    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres', 
        protocol: 'postgres', 
        logging: false, 
        dialectOptions: {
            ssl: {
                require: true, 
                rejectUnauthorized: false 
            }
        }
    })
} else {
    throw new Error(`Unsupported DB_DIALECT: ${dialect}. Use 'sqlite' or 'postgres'`)
}

export {sequelize} ; 