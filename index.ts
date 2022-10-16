import express from 'express'
import path from 'path'
import http from 'http'
import mongoose from 'mongoose'
import { config } from './src/config/config'
import Logging from './src/library/logging'
import userRouters from './src/routers/user.router'
import photoRouters from './src/routers/photo.router'
import categoryRouters from './src/routers/category.router'
import productRouters from './src/routers/product.router'
import orderRouters from './src/routers/order.router'
import transactionRouters from './src/routers/transaction.router'
import cors from 'cors'


const app = express()

const startServer = () => {

	app.use(cors({ origin: '*' }))

	/** Log the request */
	app.use((req, res, next) => {
		/** Log the req */
		Logging.info(
			`Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
		)

		res.on('finish', () => {
			/** Log the res */
			Logging.info(
				`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`
			)
		})

		next()
	})

	app.use(express.urlencoded({ extended: true }))
	app.use(express.json())
	app.use('public/uploads', express.static(path.join(__dirname, 'public/uploads')))
	/** Rules of our API */
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*')
		res.header(
			'Access-Control-Allow-Headers',
			'Origin, X-Requested-With, Content-Type, Accept, Authorization'
		)

		if (req.method == 'OPTIONS') {
			res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
			return res.status(200).json({})
		}

		next()
	})

	/** Routes */
	app.use('/users', userRouters)
	app.use('/photos', photoRouters)
	app.use('/categories', categoryRouters)
	app.use('/products', productRouters)
	app.use('/orders', orderRouters)
	app.use('/transactions', transactionRouters)

	/** Healthcheck */
	app.get('/ping', (req, res, next) => res.status(200).json({ hello: 'world' }))

	/** Error handling */
	app.use((req, res, next) => {
		const error = new Error('Not found')

		Logging.error(error)

		res.status(404).json({
			message: error.message,
		})
	})

	http
		.createServer(app)
		.listen(config.server.port, () =>
			Logging.info(`Server is running on port ${config.server.port}`)
		)
}

mongoose
	.connect(config.mongo.url, { retryWrites: true, w: 'majority' })
	.then(() => {
		Logging.info('mongoose connected!')
		startServer()
	})
	.catch((error) => {
		Logging.error('unable to connect!')
		Logging.error(error)
	})

