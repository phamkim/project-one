import dotenv from 'dotenv'

dotenv.config()

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/ecommerce'

const SERVER_PORT = process.env.SERVER_PORT || 1337

export const config = {
	mongo: {
		url: MONGO_URL,
	},
	server: {
		port: SERVER_PORT,
	},
}
