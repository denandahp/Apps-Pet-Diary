const Router = require('express').Router();
const index = require('../controllers/index.js');
/*
  @swagger
  tags:
    name: Books
    description: API to manage your books.
 */
Router.get('/', index);

module.exports = Router;