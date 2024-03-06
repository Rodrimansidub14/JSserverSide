// Import the connection object from conn.js
import pool from './conn.js'

export async function getAllPosts() {
  try {
    const [rows] = await pool.query('SELECT * FROM erblog') // Change 'erblog' to 'posts'
    return rows
  } catch (error) {
    console.error('Error getting all posts:', error)
    throw error
  }
}
export async function createPost(title, content, imageBase64) {
  try {
    const result = await pool.query(
      'INSERT INTO erblog (title, content, imageBase64) VALUES (?, ?, ?)', // Corrected table name and column names
      [title, content, imageBase64],
    )
    return result
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

export async function getPById(postId) {
  try {
    const [rows] = await pool.query('SELECT * FROM erblog WHERE id = ?', [postId]) // Change 'erblog' to 'posts'
    return rows[0] || null
  } catch (error) {
    console.error('Error getting post by id:', error)
    throw error
  }
}

export async function updatePById(postId, title, content, imageBase64) {
  try {
    const result = await pool.query(
      'UPDATE erblog SET title = ?, content = ?, imageBase64 = ? WHERE id = ?', // Change 'erblog' to 'posts' and add 'image = ?'
      [title, content, imageBase64, postId],
    )
    return result
  } catch (error) {
    console.error('Error updating post:', error)
    throw error
  }
}

export async function deletePById(postId) {
  try {
    const result = await pool.query('DELETE FROM erblog WHERE id = ?', [postId]) // Change 'erblog' to 'posts'
    return result
  } catch (error) {
    console.error('Error deleting post:', error)
    throw error
  }
}
