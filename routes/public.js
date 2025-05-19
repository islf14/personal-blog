import { Router } from 'express'
import { getAllArticles, publicViewArticle } from '../controllers/functions.js'

export const publicRouter = () => {
  const router = Router()

  router.get('/', async (req, res) => {
    const articles = await getAllArticles()
    if (articles) {
      res.render('index', { data: articles })
    } else {
      res.render('index')
    }
  })

  router.get('/article/:id', async (req, res) => {
    const { id } = req.params
    const article = await publicViewArticle({ id })
    if (!article) {
      res.redirect('/')
    } else {
      res.render('article', article)
    }
  })

  router.get('/page', (req, res) => {
    res.send('page in public')
  })

  return router
}
