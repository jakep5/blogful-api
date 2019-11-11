const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeArticlesArray } = require('./articles.fixtures')

describe.only('Articles Endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('blogful_articles').truncate()) //clears the table before tests

    afterEach('cleanup', () => db('blogful_articles').truncate())//clears the table after each test as well

    describe(`GET /articles`, () => {
        context('Given there are articles in the database', () => {
            const testArticles = makeArticlesArray();

            beforeEach('insert articles', () => { //inserts test articles before each test occurs - insures that all tests will be compared to these 4 articles
                return db
                    .into('blogful_articles')
                    .insert(testArticles)
            })
            
            it('GET /articles responds with 200 and all of the articles are returned', () => {
                return supertest(app)
                    .get('/articles')
                    .expect(200, testArticles)
            })
        })
    })


    describe(`GET /articles/:article_id`, () => {
        context('Given there are articles in the database', () => {
            const testArticles = makeArticlesArray()

            beforeEach('insert articles', () => {
                return db
                    .into('blogful_articles')
                    .insert(testArticles)
            })

            it('GET /article/:article_id responds with 200 and the specified article', () => {
                const articleId = 2
                const expectedArticle = testArticles[articleId - 1]
                return supertest(app)
                    .get(`/articles/${articleId}`)
                    .expect(200, expectedArticle)
            })
        })
    })

})