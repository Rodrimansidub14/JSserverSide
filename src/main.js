import express from 'express'
import logMessage from './logger'
import {
  getAllPosts, createPost, getPById, updatePById, deletePById,
} from './db'

const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

/**
   * @swagger
   * /:
   *   post:
   *     summary: Middleware para logging de solicitudes
   *     description: Registra cada solicitud que llega al servidor.
   *     requestBody:
   *       required: false
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RequestBody'
   *     responses:
   *       '200':
   *         description: Solicitud recibida correctamente.
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               method:
   *                 type: string
   *                 description: Método HTTP de la solicitud.
   *               url:
   *                 type: string
   *                 description: URL de la solicitud.
   *               body:
   *                 $ref: '#/components/schemas/RequestBody'
   *                 description: Cuerpo de la solicitud.
   */
app.use((req, res, next) => {
  const { method, url, body } = req
  const message = `Se recibió ${method} el request en ${url} - Body: ${JSON.stringify(body)}`
  logMessage(message)
  next()
})

/**
   * @swagger
   * /:
   *   get:
   *     summary: Middleware para verificar si el método HTTP es permitido
   *     description: Verifica si el método HTTP de la solicitud es permitido.
   *     responses:
   *       '501':
   *         $ref: '#/components/responses/MethodNotImplemented'
   *   post:
   *     summary: Middleware para verificar si el método HTTP es permitido
   *     description: Verifica si el método HTTP de la solicitud es permitido.
   *     responses:
   *       '501':
   *         $ref: '#/components/responses/MethodNotImplemented'
   *   put:
   *     summary: Middleware para verificar si el método HTTP es permitido
   *     description: Verifica si el método HTTP de la solicitud es permitido.
   *     responses:
   *       '501':
   *         $ref: '#/components/responses/MethodNotImplemented'
   *   delete:
   *     summary: Middleware para verificar si el método HTTP es permitido
   *     description: Verifica si el método HTTP de la solicitud es permitido.
   *     responses:
   *       '501':
   *         $ref: '#/components/responses/MethodNotImplemented'
   */

app.use((req, res, next) => {
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE']
  if (!allowedMethods.includes(req.method)) {
    res.status(501).send('El metodo no se ha implementado.')
  } else {
    next()
  }
})

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Retorna una lista de todos los posts.
 *     responses:
 *       200:
 *         description: Una lista de posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: El ID del post.
 *                   title:
 *                     type: string
 *                     description: El título del post.
 *                   content:
 *                     type: string
 *                     description: El contenido del post.
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
    logMessage(`Error creating a post: ${error.message}`)
    res.status(500).json({ error: error.message })
  }
})

/**
 * Endpoint para obtener todos los posts.
 * @swagger
 * /posts:
 *   get:
 *     summary: Obtener todos los posts
 *     description: Devuelve una lista de todos los posts disponibles.
 *     responses:
 *       '200':
 *         description: Se obtuvieron los posts correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Descripción del error.
 *     security: []
 */
app.get('/posts', async (req, res) => {
  try {
    const posts = await getAllPosts()
    res.status(200).json(posts)
  } catch (error) {
    logMessage(`Error getting posts: ${error.message}`)
    res.status(500).json({ error: error.message })
  }
})

/**
 * Endpoint para obtener un post por su ID.
 * @swagger
 * /posts/{postId}:
 *   get:
 *     summary: Obtener un post por su ID
 *     description: Devuelve un post específico según su ID.
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del post que se desea obtener.
 *     responses:
 *       '200':
 *         description: Se obtuvo el post correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '404':
 *         description: No se encontró ningún post con el ID proporcionado.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: No se encontró ningún post
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Descripción del error.
 *     security: []
app.get('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params
    const post = await getPById(postId)
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).send('No se encontró ningun post')
    }
  } catch (error) {
    logMessage(`Error getting post by ID: ${error.message}`)
    res.status(500).json({ error: error.message })
  }
})

 */
app.get('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params
    const post = await getPById(postId)
    if (post) {
      // Asegúrate de que la respuesta incluye la imagen en base64
      res.status(200).json(post)
    } else {
      res.status(404).send('No se encontró ningun post')
    }
  } catch (error) {
    logMessage(`Error getting post by ID: ${error.message}`)
    res.status(500).json({ error: error.message })
  }
})

/**
 * Endpoint para eliminar un post por su ID.
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Eliminar un post por su ID
 *     description: Elimina un post específico según su ID.
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del post que se desea eliminar.
 *     responses:
 *       '204':
 *         description: El post se eliminó correctamente.
 *       '404':
 *         description: No se encontró ningún post con el ID proporcionado.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: No se encontró ningún post
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Descripción del error.
 *     security: []
 */
app.get('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params
    const post = await getPById(postId)
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).send('No se encontró ningun post')
    }
  } catch (error) {
    logMessage(`Error getting post by ID: ${error.message}`)
    res.status(500).json({ error: error.message })
  }
})
/**
 * Endpoint para actualizar un post por su ID.
 * @swagger
 * /posts/{postId}:
 *   put:
 *     summary: Actualizar un post por su ID
 *     description: Actualiza un post específico según su ID.
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del post que se desea actualizar.
 *       - in: body
 *         name: body
 *         description: Datos del post que se van a actualizar.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               description: Título del post.
 *             content:
 *               type: string
 *               description: Contenido del post.
 *             imageBase64:
 *               type: string
 *               description: Imagen en formato base64 asociada al post.
 *     responses:
 *       '200':
 *         description: El post se actualizó correctamente.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Post actualizado exitosamente
 *       '404':
 *         description: No se encontró ningún post con el ID proporcionado.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Post no encontrado
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Descripción del error.
 *     security: []
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
 * Endpoint para eliminar un post por su ID.
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Eliminar un post por su ID
 *     description: Elimina un post específico según su ID.
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del post que se desea eliminar.
 *     responses:
 *       '204':
 *         description: El post se eliminó correctamente.
 *       '404':
 *         description: No se encontró ningún post con el ID proporcionado.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Post no encontrado
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Descripción del error.
 *     security: []
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
 * Middleware para manejar rutas no encontradas.
 * @swagger
 * /not-found:
 *   get:
 *     summary: Manejar rutas no encontradas
 *     description: Maneja las solicitudes a rutas que no se encuentran.
 *     responses:
 *       '404':
 *         description: Ruta no encontrada.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: No se ha encontrado el endpoint
 *     security: []
 */

app.use((req, res) => {
  res.status(404).send('No se ha encontrado el endpoint')
})

/**
 * Middleware para manejar errores generales.
 * @swagger
 * /error:
 *   get:
 *     summary: Manejar errores generales
 *     description: Maneja los errores generales que ocurren en el servidor.
 *     responses:
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Descripción del error.
 *     security: []
 */

app.use((error, req, res) => {
  const status = error.status || 500
  const message = error.message || 'Error Interno de Servidor'
  logMessage(`Error ${status}: ${message}`)
  res.status(status).json({ error: message })
})

const port = 3000
app.listen(port, () => {
  console.log(`Server listening at http://127.0.0.1:${port}`)
})
