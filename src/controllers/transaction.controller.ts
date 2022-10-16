import { NextFunction, Request, Response } from 'express'
import mongoose, { FilterQuery } from 'mongoose'
import Logging from '../library/logging'
import transactionModel, { ITransactionDocument } from '../models/transaction.model'


const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { order, state, priceTotal, user } = req.body
		const transaction: ITransactionDocument = new transactionModel({
			_id: new mongoose.Types.ObjectId(),
			order,
			state,
			priceTotal,
			user,
		})
		const transaction_created = await transaction.save()
		return res.status(201).json({ transaction_created })
	} catch (error) {
		next(error)
	}
}

const updateTransaction = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.params.id
		transactionModel.findById(id).then((transaction) => {
			if (transaction) {
				transaction.set(req.body)
				return transaction
					.save()
					.then((transaction) => res.status(201).json({ transaction }))
					.catch((error) => res.status(500).json({ error }))
			} else res.status(404).json({ message: 'not found' })
		})
	} catch (error) {
		next(error)
	}
}

const findAllTransaction = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId :string = req.query.userId as string
		const state : string = req.query.state as string

		let query: FilterQuery<ITransactionDocument> = {}
		if (userId && userId !== '') {
			query.user = new mongoose.Types.ObjectId(userId)
		}

		if(state&& state !==''){
			query.state = state
		}

		transactionModel
			.find(query)
			.populate({
				path: 'order',
				populate: {
					path: 'product',
				},
			})
			.then((transactions) => res.status(200).json({ transactions }))
			.catch((error) => res.status(500).json({ error }))
	} catch (error) {
		next(error)
	}
}

const findTransactionById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.params.id
		transactionModel
			.findById(id)
			.populate({
				path: 'order',
				populate: {
					path: 'product',
				},
			})
			.populate('user')
			.then((transaction) => res.status(200).json({ transaction }))
			.catch((error) => res.status(500).json({ error }))
	} catch (error) {
		next(error)
	}
}

const deleteTransaction = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.params.id
		transactionModel
			.findByIdAndDelete(id)
			.then((transaction) => res.status(200).json({ transaction }))
			.catch((error) => res.status(500).json({ error }))
	} catch (error) {
		next(error)
	}
}

export default {
	createTransaction,
	updateTransaction,
	deleteTransaction,
	findAllTransaction,
	findTransactionById,
}
