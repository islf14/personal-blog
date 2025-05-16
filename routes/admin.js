import { Router } from 'express'
import { authMiddleware } from '../auth.js'
import { getAllArticles, viewArticle } from './functions.js'

export const adminRouter = () => {
  const router = Router()

  router.use(authMiddleware)

  router.get('/', async (req, res) => {
    const articles = await getAllArticles()
    articles.admin = true
    res.render('index', articles)
  })

  router.get('/new', (req, res) => {
    console.log('new')
    res.render('form')
  })

  router.get('/edit/:id', async (req, res) => {
    const { id } = req.params
    const article = await viewArticle({ id })
    console.log(article)
    if (article.data === undefined) {
      res.redirect('/admin')
    } else {
      res.render('form', article)
    }
  })

  return router
}
