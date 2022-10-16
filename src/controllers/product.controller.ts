import { NextFunction, Request, Response } from 'express'
import mongoose, { FilterQuery } from 'mongoose'
import productModel, { IProductDocument } from '../models/product.model'

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, photo, description, quantity, price, discount, category } = req.body
		const product: IProductDocument = new productModel({
			_id: new mongoose.Types.ObjectId(),
			name,
			photo,
			description,
			quantity,
			price,
			discount,
			category,
		})
		const product_created = await product.save()
		return res.status(201).json({ product_created })
	} catch (error) {
		next(error)
	}
}

const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.params.id
		return productModel.findById(id).then((product) => {
			if (product) {
				product.set(req.body)
				return product
					.save()
					.then((product) => res.status(201).json({ product }))
					.catch((error) => res.status(500).json({ error }))
			} else res.status(404).json({ message: 'not found' })
		})
	} catch (error) {
		next(error)
	}
}

const findAllProduct = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const categoryId: string = req.query.categoryId as string

		let query: FilterQuery<IProductDocument> = {}
		if (categoryId && categoryId !== '') {
			query.category = new mongoose.Types.ObjectId(categoryId)
		}

		productModel
			.find(query)
			.then((products) => res.status(200).json({ products }))
			.catch((error) => res.status(500).json({ error }))
	} catch (error) {
		next(error)
	}
}
const findProductById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.params.id
		productModel
			.findById(id)
			.then((product) => res.status(200).json({ product }))
			.catch((error) => res.status(500).json({ error }))
	} catch (error) {
		next(error)
	}
}

const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.params.id
		productModel
			.findByIdAndDelete(id)
			.then((product) => res.status(200).json({ product }))
			.catch((error) => res.status(500).json({ error }))
	} catch (error) {
		next(error)
	}
}

export default { createProduct, updateProduct, deleteProduct, findAllProduct, findProductById }
