const express = require('express')
const app = express()
const conn = require('./database/database')

const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')
const Article = require('./articles/Article')
const Category = require('./categories/Category')

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

app.get('/', (req, res) => {
  Article.findAll().then(articles => {
    res.render('index', { articles: articles })
  })
})

app.get('/:slug', (req, res) => {
  const slug = req.params.slug
  Article.findBy({
    where: {
      slug: slug
    }
  })
    .then(article => {
      if (article != undefined) {
        res.render('article', { article: article })
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
