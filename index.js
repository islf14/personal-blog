import express, { json, urlencoded } from 'express'
import { publicRouter } from './routes/public.js'
import { adminRouter } from './routes/admin.js'

const app = express()
const port = 3000
app.set('view engine', 'ejs')
app.use(json())
app.use(urlencoded())

app.use('/', publicRouter())
app.use('/admin', adminRouter())
app.use(express.static('public'))

app.use((req, res) => {
  res.status(404).send('<h1>404</h1>')
})

app.listen(port, () => {
  console.log(`app listening http://localhost:${port}`)
})
