import express from 'express'
import cors from 'cors'
import {
  getAllPosts, createPost, getPById, updatePById, deletePById,
} from './db.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.json({ limit: '10mb' })) // Set limit as appropriate

app.get('/', (_req, res) => {
  res.send('Bienvenido al servidor del blog')
})

app.get('/posts', async (_req, res) => {
  try {
    const posts = await getAllPosts()
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params
    const post = await getPById(postId)
    if (post) {
      res.status(200).json(post)
    } else {
      console.log(req.method, req.headers, req.body)
      res.status(404).send('No se encontró ningún post')
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// eslint-disable-next-line consistent-return
app.post('/posts', async (req, res) => {
  console.log(req.method, req.headers, req.body)
  // Log the body to see what is being received
  const { title, content, imageBase64 } = req.body
  if (!title || !content) {
    return res.status(400).json({ error: 'Titulo y contenido son requeridos.' })
  }

  try {
    const result = await createPost(title, content, imageBase64)
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/posts/:postId', async (req, res) => {
  const { title, content, imageBase64 } = req.body
  try {
    const result = await updatePById(req.params.postId, title, content, imageBase64)
    if (result.affectedRows > 0) {
      console.log(req.method, req.headers, req.body)
      res.status(200).send('Post updated successfully')
    } else {
      console.log(req.method, req.headers, req.body)
      res.status(404).send('Post not found')
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/posts/:postId', async (req, res) => {
  try {
    const result = await deletePById(req.params.postId)
    if (result.affectedRows > 0) {
      res.status(204).send()
    } else {
      res.status(404).send('Post not found')
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.use((_req, res) => {
  res.status(404).send('No se ha encontrado el endpoint')
})

app.use((error, _req, res) => {
  const status = error.status || 500
  const message = error.message || 'Error Interno de Servidor'
  res.status(status).json({ error: message })
})

const port = 5000
app.listen(port, () => {
  console.log(`Server listening at http://127.0.0.1:${port}`)
})
