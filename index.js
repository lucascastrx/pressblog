const express = require('express')
const app = express()
const conn = require('./database/database')

const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')
const usersController = require('./user/UserController')
const Article = require('./articles/Article')
const Category = require('./categories/Category')
const User = require('./user/User')

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public/css'))

conn
  .authenticate()
  .then(() => {
    console.log('Connection completed!')
  })
  .catch(e => {
    console.log(e)
  })

app.use('/', categoriesController)
app.use('/', articlesController)
app.use('/', usersController)

app.get('/', (req, res) => {
  let PAGE_AMOUNT = 2

  Article.findAll({
    order: [['id', 'DESC']],
    limit: PAGE_AMOUNT
  }).then(articles => {
    Category.findAll().then(categories => {
      res.render('index', { articles: articles, categories: categories })
    })
  })
})

app.get('/:slug', (req, res) => {
  const slug = req.params.slug
  Article.findOne({
    where: {
      slug: slug
    }
  })
    .then(article => {
      if (article != undefined) {
        Category.findAll().then(categories => {
          res.render('article', { article: article, categories: categories })
        })
      } else {
        res.redirect('/')
      }
    })
    .catch(e => {
      res.redirect('/')
    })
})

app.get('/category/:slug', (req, res) => {
  const slug = req.params.slug
  Category.findOne({
    where: {
      slug: slug
    },
    include: [{ model: Article }]
  })
    .then(category => {
      if (category != undefined) {
        Category.findAll().then(categories => {
          res.render('index', {
            articles: category.articles,
            categories: categories
          })
        })
      } else {
        res.redirect('/')
      }
    })
    .catch(e => {
      res.redirect('/')
    })
})

app.listen(8080, () => {
  console.log('Server de pé!')
})
