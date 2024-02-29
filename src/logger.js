import fs from 'fs'
import path from 'path'

const logFilePath = path.join(__dirname, 'log.txt')

export default function logMessage(message) {
  const timestamp = new Date().toISOString()
  const logEntry = `${timestamp} - ${message}\n`

  fs.appendFile(logFilePath, logEntry, (error) => {
    if (error) {
      console.error('Error al escribir el log en el archivo', error)
    }
  })
}
