import express, { json, urlencoded } from 'express'
import { publicRouter } from './routes/public.js'
import { adminRouter } from './routes/admin.js'
import { join } from 'node:path'
// import logger from 'morgan'

const app = express()
const port = 3000
app.set('view engine', 'ejs')
app.use(json())
app.use(urlencoded())

// app.use(logger('dev'))

app.use('/', publicRouter())
app.use('/admin', adminRouter())
app.use(express.static(join(process.cwd(), '/public')))

app.use((req, res) => {
  res.status(404).send('<h1>404</h1>')
})

app.listen(port, () => {
  console.log(`app listening http://localhost:${port}`)
})
