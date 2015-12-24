import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'

export default function() {
  const ENV_FILE = path.resolve(__dirname, '../../../.env')

  try {
    if (fs.lstatSync(ENV_FILE))
      dotenv({path: ENV_FILE})
  } catch(e) {

  }
}
