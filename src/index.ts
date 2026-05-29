import 'dotenv/config'
import express from 'express'
import path from 'path'
import postSiteRouter from './routes/post.routes'

const app = express()
const port = Number(process.env.PORT) || 4000

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.get('/api/categories', async (req, res) => {
  try {
    const response = await fetch(`${process.env.MYSITE_URL}/categories`)
    const data = await response.json()
    res.json(data)
  } catch {
    res.status(500).json([])
  }
})

app.use(postSiteRouter)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})