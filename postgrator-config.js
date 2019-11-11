require('dotenv').config();

module.exports = {
    "migrationsDirectory": "migrations",
    "driver": "pg",
    "connectionString": (process.env.NODE_ENV === 'test') //if node environment is testing environment
        ? process.env.TEST_DB_URL
        : process.env.DB_URL
}