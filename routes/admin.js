import { Router } from 'express'
import { authMiddleware } from '../auth.js'
import { adminViewArticle, createBlog, dateToForm, deleteBlog, getAllArticles, updateBlog } from '../controllers/functions.js'

export const adminRouter = () => {
  const router = Router()

  router.use(authMiddleware)

  router.get('/', async (req, res) => {
    const articles = await getAllArticles()
    if (articles) {
      const allData = {
        data: articles,
        admin: true
      }
      res.render('index', allData)
    } else {
      res.render('index', { admin: true })
    }
  })

  router.get('/new', (req, res) => {
    const date = dateToForm({ dbDate: new Date() })
    res.render('form', { date })
  })

  router.post('/create', async (req, res) => {
    const result = await createBlog({ input: req.body })
    if (result) {
      res.redirect('/admin')
    } else {
      res.render('form', { error: 'Not saved, try again.' })
    }
  })

  router.get('/edit/:id', async (req, res) => {
    const { id } = req.params
    const article = await adminViewArticle({ id })
    if (!article) {
      res.redirect('/admin')
    } else {
      res.render('form', article)
    }
  })

  router.post('/update/:id', async (req, res) => {
    const { id } = req.params
    const result = await updateBlog({ input: req.body, id })
    if (!result) {
      console.log('does not exist file')
    }
    res.redirect('/admin')
  })

  router.get('/delete/:id', async (req, res) => {
    const { id } = req.params
    const result = await deleteBlog({ id })
    if (!result) console.log('Cannot delete, please try again.')
    res.redirect('/admin')
  })

  return router
}
