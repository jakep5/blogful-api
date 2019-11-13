const path = require('path')
const express = require('express')
const xss = require('xss')
const UsersService = require('./users-service')

const usersRouter = express.Router();
const jsonParser = express.json();

const serializeUser = user => ({
    id: user.id,
    fullname: xss(user.fullname),
    username: xss(user.username),
    nickname: xss(user.nickname),
    date_created: user.date_created,
})

usersRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        UsersService.getAllUsers(knexInstance)
            .then(users => {
                res.json(users.map(serializeUser))
            })
            .catch(next)
    })