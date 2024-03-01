// Import the connection object from conn.js
import pool from './conn.js'

export async function getAllPosts() {
  try {
    const [rows] = await pool.query('SELECT * FROM erblog')
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
    const [rows] = await pool.query('SELECT * FROM erblog WHERE id = ?', [postId])
    return rows[0] || null
  } catch (error) {
    console.error('Error getting post por id:', error)
    throw error
  }
}

export async function updatePById(postId, title, content, imageBase64) {
  try {
    const result = await pool.query(
      'UPDATE erblog SET title = ?, content = ? WHERE id = ?',
      [title, content, postId, imageBase64],
    )
    return result
  } catch (error) {
    console.error('Error actualizando post:', error)
    throw error
  }
}

export async function deletePById(postId) {
  try {
    const result = await pool.query('DELETE FROM erblog WHERE id = ?', [postId])
    return result
  } catch (error) {
    console.error('Error eliinando post:', error)
    throw error
  }
}
