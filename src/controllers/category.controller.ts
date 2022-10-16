import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import categoryModel, { ICategoryDocument } from '../models/category.model'

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, photo, description } = req.body
		const category: ICategoryDocument = new categoryModel({
			_id: new mongoose.Types.ObjectId(),
			name,
			photo,
			description,
		})
		const category_created = await category.save()
		return res.status(201).json({ category_created })
	} catch (error) {
		next(error)
	}
}

const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.params.id
		const { name, photo, description } = req.body
		return categoryModel.findById(id).then((category) => {
			if (category) {
				category.set(name, photo, description)
				return category
					.save()
					.then((category) => res.status(201).json({ category }))
					.catch((error) => res.status(500).json({ error }))
			} else res.status(404).json({ message: 'not found' })
		})
	} catch (error) {
		next(error)
	}
}

const findAllCategory = async (req: Request, res: Response, next: NextFunction) => {
	try {
		categoryModel
			.find()
			// .populate('photo')
			.then((categories) => res.status(200).json({ categories }))
			.catch((error) => res.status(500).json({ error }))
	} catch (error) {
		next(error)
	}
}

const findCategoryById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.params.id
		const category = await categoryModel.findById(id)
		// .populate('photo')
		return category
			? res.status(200).json({ category })
			: res.status(404).json({ message: 'not found' })
	} catch (error) {
		next(error)
	}
}

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.params.id
		categoryModel
			.findByIdAndDelete(id)
			.then((category) =>
				category
					? res.status(200).json({ category })
					: res.status(404).json({ message: 'not found' })
			)
			.catch((error) => res.status(500).json({ error }))
	} catch (error) {
		next(error)
	}
}

export default { createCategory, updateCategory, deleteCategory, findAllCategory, findCategoryById }
