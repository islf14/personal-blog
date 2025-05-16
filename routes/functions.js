import { join } from 'node:path'
import fs from 'node:fs/promises'

const monthNames = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
]

export async function getAllArticles () {
  const pathArticles = join(process.cwd(), '/articles')
  // read all file names
  let files
  try {
    files = await fs.readdir(pathArticles)
  } catch (error) {}
  // read all files
  const articlesPromises = files.map(async file => {
    try {
      const data = await fs.readFile(join(pathArticles, file), 'utf-8')
      const jsonData = JSON.parse(data)
      const date = new Date(jsonData.createdAt)
      const stringDate = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
      jsonData.createdAt = stringDate
      return jsonData
    } catch (error) {}
  })
  const articles = await Promise.all(articlesPromises)
  const allData = {
    data: articles,
    admin: false
  }
  return allData
}

export async function viewArticle ({ id }) {
  const pathArticles = join(process.cwd(), '/articles')
  let article
  // read an article
  try {
    const data = await fs.readFile(join(pathArticles, `${id}.json`), 'utf-8')
    const jsonData = JSON.parse(data)
    const date = new Date(jsonData.createdAt)
    const stringDate = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    jsonData.createdAt = stringDate
    article = jsonData
  } catch (error) {}
  const allData = {
    data: article,
    admin: false
  }
  return allData
}
