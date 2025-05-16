import { Router } from 'express'
import { getAllArticles, viewArticle } from './functions.js'

export const publicRouter = () => {
  const router = Router()

  router.get('/', async (req, res) => {
    const articles = await getAllArticles()
    console.log(articles)
    res.render('index', articles)
  })

  router.get('/article/:id', async (req, res) => {
    const { id } = req.params
    const article = await viewArticle({ id })
    console.log(article)
    if (article.data === undefined) {
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
