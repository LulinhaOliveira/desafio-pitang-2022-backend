const NodeEnvironment = require('jest-environment-node');
const { v4: uuid } = require('uuid');
const { execSync } = require('child_process');
const { resolve } = require('path');
const { Sequelize } = require('sequelize');


require('dotenv').config({
    path: resolve(__dirname, '..', '.env.test'),
});



class CustomEnvironment extends NodeEnvironment {
    constructor(config) {
        super(config);
        this.connectionString = `${process.env.DATABASE_URL}`;
       
    }

    

    setup() {
        process.env.DATABASE_URL = this.connectionString;
   
        this.global.process.env.DATABASE_URL = this.connectionString;
    
        execSync(`npx prisma migrate dev`);
    }

     async teardown(){
        try {
            const sequelize = new Sequelize(this.connectionString);
            await sequelize.query(`DROP DATABASE pitang_challeng_test`)
            sequelize.close();
        } catch (error) {
            console.log(error);
        }

    }
}

module.exports = CustomEnvironment;