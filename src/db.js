// Import the connection object from conn.js
import pool from './conn'

export async function getAllPosts() {
  try {
    const [rows] = await pool.query('SELECT * FROM blog_posts')
    return rows
  } catch (error) {
    console.error('Error getting all posts:', error)
    throw error
  }
}

export async function createPost(title, content, imageBase64) {
  try {
    const result = await pool.query('INSERT INTO posts (title, content, image) VALUES (?, ?, ?)', [title, content, imageBase64])
    return result
  } catch (error) {
    console.error('Error al crear a post:', error)
    throw error
  }
}

export async function getPById(postId) {
  try {
    const [rows] = await pool.query('SELECT * FROM blog_posts WHERE id = ?', [postId])
    return rows[0] || null
  } catch (error) {
    console.error('Error getting post por id:', error)
    throw error
  }
}

export async function updatePById(postId, title, content) {
  try {
    const result = await pool.query(
      'UPDATE blog_posts SET title = ?, content = ? WHERE id = ?',
      [title, content, postId],
    )
    return result
  } catch (error) {
    console.error('Error actualizando post:', error)
    throw error
  }
}

export async function deletePById(postId) {
  try {
    const result = await pool.query('DELETE FROM blog_posts WHERE id = ?', [postId])
    return result
  } catch (error) {
    console.error('Error eliinando post:', error)
    throw error
  }
}
