import { join } from 'node:path'
import fs, { mkdir, unlink } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export async function getAllArticles() {
  const pathArticles = join(process.cwd(), '/articles')
  // read all file names
  let files
  try {
    files = await fs.readdir(pathArticles)
  } catch (error) {}
  if (files === undefined) {
    return false
  }
  // read all files
  const articlesPromises = files.map(async (file) => {
    try {
      const data = await fs.readFile(join(pathArticles, file), 'utf-8')
      const jsonData = JSON.parse(data)
      const date = new Date(jsonData.updatedAt)
      const stringDate = `${
        monthNames[date.getMonth()]
      } ${date.getDate()}, ${date.getFullYear()}`
      jsonData.updatedAt = stringDate
      return jsonData
    } catch (error) {}
  })
  const articles = await Promise.all(articlesPromises)
  return articles
}

export async function publicViewArticle({ id }) {
  const article = await viewArticle({ id })
  if (article === undefined) return null
  const date = new Date(article.updatedAt)
  const stringDate = `${
    monthNames[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()}`
  article.updatedAt = stringDate
  const articleData = {
    data: article,
    date: new Date()
  }
  return articleData
}

export async function adminViewArticle({ id }) {
  const article = await viewArticle({ id })
  if (article === undefined) return null
  article.createdAt = dateToForm({ dbDate: article.createdAt })
  article.updatedAt = dateToForm({ dbDate: article.updatedAt })
  const actualDate = dateToForm({ dbDate: new Date() })
  const articleData = {
    data: article,
    date: actualDate
  }
  return articleData
}

export function dateToForm({ dbDate }) {
  const date = new Date(dbDate)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const localeTime = date.toLocaleTimeString('en-GB')
  const hour = localeTime.split(':')
  return `${date.getFullYear()}-${month}-${day}T${hour[0]}:${hour[1]}:${
    hour[2]
  }`
}

async function viewArticle({ id }) {
  const pathArticles = join(process.cwd(), '/articles')
  let article
  // read an article
  try {
    const data = await fs.readFile(join(pathArticles, `${id}.json`), 'utf-8')
    const jsonData = JSON.parse(data)
    article = jsonData
  } catch (error) {}
  return article
}

export async function createBlog({ input }) {
  const pathArticles = join(process.cwd(), '/articles')
  // read all files
  let files
  try {
    files = await fs.readdir(pathArticles)
  } catch (error) {}
  let id = 1
  if (files !== undefined) {
    // read every file
    const articlesPromises = files.map(async (file) => {
      try {
        const data = await fs.readFile(join(pathArticles, file), 'utf-8')
        return JSON.parse(data)
      } catch (error) {}
    })
    const articles = await Promise.all(articlesPromises)
    // find ID
    if (articles.length > 0) {
      for (const property in articles) {
        if (articles[property].id >= id) id = articles[property].id + 1
      }
    }
  }
  // create new blog
  const newBlog = {
    id,
    title: input.title,
    createdAt: new Date(),
    updatedAt: new Date(),
    content: input.content
  }
  const blog = await writeJson({ data: newBlog, name: id })
  return blog
}

async function writeJson({ data, name }) {
  const pathArticles = join(process.cwd(), '/articles')
  // create directory
  if (!existsSync(pathArticles)) {
    console.log('The path do not exists.')
    await mkdir(pathArticles)
  }
  // create blog json
  const pathArticle = join(pathArticles, `/${name}.json`)
  const jsonData = JSON.stringify(data, null, 2)
  try {
    await fs.writeFile(pathArticle, jsonData, 'utf8')
    return true
  } catch (error) {
    console.log('Cannot create JSON')
    return false
  }
}

export async function updateBlog({ input, id }) {
  const article = await viewArticle({ id })
  if (article) {
    const updatedArticle = {
      ...article,
      title: input.title,
      updatedAt: new Date(input.date),
      content: input.content
    }
    const blog = await writeJson({ data: updatedArticle, name: id })
    return blog
  } else {
    return false
  }
}

export async function deleteBlog({ id }) {
  const pathArticle = join(process.cwd(), `/articles/${id}.json`)
  try {
    await unlink(pathArticle)
    return true
  } catch (error) {
    return false
  }
}
