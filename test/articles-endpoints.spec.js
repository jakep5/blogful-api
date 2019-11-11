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
        context(`Given no articles`, () => {
            it(`responds with 200 and an empty list`, () => { //no beforeEach statement to insert articles, so table will automatically be empty
                return supertest(app)
                    .get('/articlces')
                    .expect(200, [])
            })
        })
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

        context(`Given no articles`, () => {
            it(`responds with 404`, () => {
                const articleId = 123456
                return supertest(app)
                    .get(`/articles/${articleId}`)
                    .expect(404, { error: { message: `Article doesn't exist` }})
            })
        })
    })

    describe.only(`Post /articles`, () => {
        it(`creates an article, responding with 201 and the new article`, function() {
            const newArticle = {
                title: 'Test new article',
                style: 'Listicle',
                content: 'Test new article content...'
            }
            return supertest(app)
                .post('/articles')
                .send(newArticle)
                .expect(201)
                .expect(res => {
                    expect(res.body.title).to.eql(newArticle.title)
                    expect(res.body.style).to.eql(NewArticle.style)
                    expect(res.body.content).to.eql(newArticle.content)
                    expect(res.body).to.have.property('id')
                })
        })
    })

})