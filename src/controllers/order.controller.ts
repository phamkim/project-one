import { NextFunction, Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import mongoose from 'mongoose'
import Logging from '../library/logging'
import { isUser } from '../middleware/validateRole'
import orderModel, { IOrderDocument } from '../models/order.model'

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { product, quantity, priceUnit } = req.body
		const order: IOrderDocument = new orderModel({
			_id: new mongoose.Types.ObjectId(),
			product,
			quantity,
			priceUnit,
		})
		
		const order_created = await order.save()
		orderModel
			.findById(order_created._id)
			.populate('product')
			.then((order) => res.status(201).json({ order }))
			.catch((error) => res.status(500).json({ error }))
	} catch (error) {
		next(error)
	}
}

const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { product, quantity, priceUnit } = req.body
		const id = req.params.id
		return orderModel
			.findById(id)
			.then((order) => {
				if (order) {
					order.set(product, quantity, priceUnit)
					return order
						.save()
						.then((order) => res.status(201).json({ order }))
						.catch((error) => res.status(500).json({ error }))
				} else res.status(404).json({ message: 'not found' })
			})
			.catch((error) => res.status(500).json({ error }))
	} catch (error) {
		next(error)
	}
}

const findAllOrder = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const jwtPayload: JwtPayload = req.jwtPayload
		Logging.info(jwtPayload['userId'])
		var istrue: boolean = await isUser(jwtPayload['userId'])
		if (istrue) {
			orderModel
				.find()
				.populate('product')
				.then((orders) => res.status(200).json({ orders }))
				.catch((error) => res.status(401).json({ error }))
		} else {
			res.status(500).json({ message: 'you are not user' })
		}
	} catch (error) {
		next(error)
	}
}



const findOrderById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.params.id
		orderModel
			.findById(id)
			.populate('product')
			.then((order) => res.status(200).json({ order }))
			.catch((error) => res.status(500).json({ error }))
	} catch (error) {
		next(error)
	}
}

const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.params.id
		orderModel
			.findByIdAndDelete(id)
			.then((order) =>
				order ? res.status(200).json({ order }) : res.status(404).json({ message: 'not found' })
			)
			.catch((error) => res.status(500).json({ error }))
	} catch (error) {
		next(error)
	}
}

export default {
	createOrder,
	updateOrder,
	deleteOrder,
	findAllOrder,
	findOrderById,
}
