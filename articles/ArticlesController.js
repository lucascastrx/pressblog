const express = require('express')
const router = express.Router()
const Category = require('../categories/Category')
const Article = require('./Article')
const slugify = require('slugify')
const Auth = require('../middlewares/adminAuth')

router.get('/admin/articles', Auth, (req, res) => {
  Article.findAll({
    include: [{ model: Category }]
  }).then(articles => {
    res.render('admin/articles/index', { articles: articles })
  })
})

router.get('/admin/articles/new', Auth, (req, res) => {
  Category.findAll().then(categories => {
    res.render('admin/articles/new', { categories: categories })
  })
})

router.get('/admin/articles/edit/:id', Auth, (req, res) => {
  const id = req.params.id

  if (isNaN(id)) {
    res.redirect('/admin/articles')
  }

  Article.findByPk(id)
    .then(article => {
      if (article != undefined) {
        Category.findAll().then(categories => {
          res.render('admin/articles/edit', {
            article: article,
            categories: categories
          })
        })
      } else {
        res.redirect('/admin/articles')
      }
    })
    .catch(e => {
      res.redirect('/admin/articles')
    })
})

router.get('/articles/page/:num', (req, res) => {
  const page = req.params.num
  let offset = 0
  let PAGE_AMOUNT = 2

  if (page < 1) {
    res.redirect('/')
  } else if (!isNaN(page) && page > 1) {
    offset = (parseInt(page) - 1) * PAGE_AMOUNT
  }

  Article.findAndCountAll({
    limit: PAGE_AMOUNT,
    offset: offset,
    order: [['id', 'DESC']]
  }).then(articles => {
    let next = true
    if (offset + PAGE_AMOUNT >= articles.count) {
      next = false
    }
    let result = { articles: articles, next: next, page: parseInt(page) }

    Category.findAll().then(categories => {
      res.render('admin/articles/page', {
        result: result,
        categories: categories
      })
    })
  })
})

router.post('/articles/save', Auth, (req, res) => {
  const title = req.body.title
  const body = req.body.body
  const category = req.body.category

  Article.create({
    title: title,
    slug: slugify(title),
    body: body,
    categoryId: category
  }).then(() => {
    res.redirect('/admin/articles')
  })
})

router.post('/articles/delete', Auth, (req, res) => {
  const id = req.body.id
  if (id != undefined) {
    if (!isNaN(id)) {
      Article.destroy({
        where: {
          id: id
        }
      }).then(() => {
        res.redirect('/admin/articles')
      })
    } else {
      res.redirect('/admin/articles')
    }
  } else {
    res.redirect('/admin/articles')
  }
})

router.post('/articles/update', Auth, (req, res) => {
  const id = req.body.id
  const title = req.body.title
  const body = req.body.body
  const categoryId = req.body.category

  Article.update(
    {
      title: title,
      slug: slugify(title),
      body: body,
      categoryId: categoryId
    },
    {
      where: {
        id: id
      }
    }
  ).then(() => {
    res.redirect('/admin/articles')
  })
})

module.exports = router
