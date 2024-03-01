import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import specs from './swagger.js'
import {
  getAllPosts, createPost, getPById, updatePById, deletePById,
} from './db.js'

const app = express()

app.use(cors())
app.use(express.json())

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     description: Returns a welcome message to the blog server.
 *     responses:
 *       200:
 *         description: A welcome message.
 */
app.get('/', (_req, res) => {
  res.send('Bienvenido al servidor del blog')
})

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Retrieve all posts
 *     description: Retrieves a list of all blog posts.
 *     responses:
 *       200:
 *         description: A list of blog posts.
 */
app.get('/posts', async (_req, res) => {
  try {
    const posts = await getAllPosts()
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     summary: Retrieve a post by ID
 *     description: Retrieves the details of a blog post by its ID.
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID of the post to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested blog post.
 *       404:
 *         description: Post not found.
 */
app.get('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params
    const post = await getPById(postId)
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).send('No se encontró ningún post')
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     description: Creates a new blog post with the provided title, content, and optional image.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               imageBase64:
 *                 type: string
 *     responses:
 *       201:
 *         description: The newly created blog post.
 *       400:
 *         description: Invalid request body.
 *       500:
 *         description: Internal server error.
 */
// eslint-disable-next-line consistent-return
app.post('/posts', async (req, res) => {
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

/**
 * @swagger
 * /posts/{postId}:
 *   put:
 *     summary: Update a post
 *     description: Updates an existing blog post
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID of the post to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               imageBase64:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Internal server error.
 */
app.put('/posts/:postId', async (req, res) => {
  const { title, content, imageBase64 } = req.body
  try {
    const result = await updatePById(req.params.postId, title, content, imageBase64)
    if (result.affectedRows > 0) {
      res.status(200).send('Post updated successfully')
    } else {
      res.status(404).send('Post not found')
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Delete a post
 *     description: Deletes an existing blog post by its ID.
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID of the post to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Post deleted successfully.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Internal server error.
 */
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

/**
 * @swagger
 * /:
 *   get:
 *     summary: Error handler for undefined endpoints
 *     description: Returns a message for undefined endpoints.
 *     responses:
 *       404:
 *         description: Endpoint not found.
 */
app.use((_req, res) => {
  res.status(404).send('No se ha encontrado el endpoint')
})

/**
 * @swagger
 * /:
 *   get:
 *     summary: Error handler for internal server errors
 *     description: Returns a message for internal server errors.
 *     responses:
 *       500:
 *         description: Internal server error.
 */
app.use((error, _req, res) => {
  const status = error.status || 500
  const message = error.message || 'Error Interno de Servidor'
  res.status(status).json({ error: message })
})

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

const port = 3000
app.listen(port, () => {
  console.log(`Server listening at http://127.0.0.1:${port}`)
})
