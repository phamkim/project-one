import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import Photo from '../models/photo.model'
import path from 'path'
import fs from 'fs'

const createPhoto = async (req: Request, res: Response, next: NextFunction) => {
	const { description } = req.body
	const photo = new Photo({
		_id: new mongoose.Types.ObjectId(),
		name: req.file?.originalname,
		imagePath: req.file?.filename,
		mimetype: req.file?.mimetype,
		description,
	})
	try {
		const photo_created = await photo.save()
		return res.status(201).json({ photo_created })
	} catch (error) {
		return res.status(500).json({ error })
	}
}

const updatePhoto = async (req: Request, res: Response, next: NextFunction) => {
	const imagePath = req.file?.filename
	const name = req.file?.originalname ?? ''
	const mimetype = req.file?.mimetype
	const description = req.body
	const id = req.params.id
	return Photo.findById(id)
		.then((photo) => {
			if (photo) {
				photo.set(name, imagePath, mimetype, description)
				return photo
					.save()
					.then((photo) => res.status(201).json({ photo }))
					.catch((error) => res.status(500).json({ error }))
			} else res.status(404).json({ message: 'not found' })
		})
		.catch((error) => res.status(500).json({ error }))
}

const deletePhoto = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id
	return Photo.findByIdAndDelete(id)
		.then((photo) =>
			photo ? res.status(200).json({ photo }) : res.status(404).json({ message: 'not found' })
		)
		.catch((error) => res.status(500).json({ error }))
}

const findAllPhoto = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id
	return Photo.find()
		.then((photos) => res.status(200).json({ photos }))
		.catch((error) => res.status(500).json({ error }))
}

const findPhotoById = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id
	try {
		const photo = await Photo.findById(id)
		return photo ? res.status(200).json({ photo }) : res.status(404).json({ message: 'not found' })
	} catch (error) {
		return res.status(500).json({ error })
	}
}

const watchPhotoById = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id
	try {
		const photo = await Photo.findById(id)
		if (photo !== null) {
			const _path = path.join(__dirname, '../../public/uploads/') + photo.imagePath
			var bitmap = fs.readFileSync(_path)
			return res.status(200).contentType(photo.mimetype).send(bitmap)
		}
	} catch (error) {
		return res.status(500).json({ error })
	}
}

export default {
	createPhoto,
	deletePhoto,
	updatePhoto,
	findAllPhoto,
	findPhotoById,
	watchPhotoById,
}
