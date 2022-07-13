

require('dotenv').config()

const bcrypt = require("bcrypt");





const saltRounds = 10

export const generateAPIKey = async (password: string): Promise<string> => {

  const hashedPassword = await bcrypt.hash(password, saltRounds)

  return hashedPassword
};