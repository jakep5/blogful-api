const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')

describe('Articles Endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('blogful_articles').truncate()) //clears the table before tests

})