import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import userModel, { IUserDocment } from '../models/user.model'
import { signAccessToken, signRefereshToken } from '../library/jwt'
import { verifiRefreshToken } from '../middleware/verifiToken'
import Logging from '../library/logging'

const createUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { displayName, userName, passWord, photo, role, refreshToken } = req.body
		const user: IUserDocment = new userModel({
			_id: new mongoose.Types.ObjectId(),
			displayName,
			userName,
			passWord,
			photo,
			role,
			refreshToken,
		})

		const isExist = await userModel.findOne({
			userName,
		})
		if (isExist) {
			return res.status(201).json({ mesage: 'user already exists' })
		} else {
			const user_created = await user.save()
			return res.status(201).json({ user_created })
		}
	} catch (error) {
		return res.status(500).json({ error })
	}
}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id
	return userModel
		.findById(id)
		.then((user) => {
			if (user) {
				user.set(req.body)
				return user
					.save()
					.then((user) => res.status(201).json({ user }))
					.catch((error) => res.status(500).json({ error }))
			} else res.status(404).json({ message: 'not found' })
		})
		.catch((error) => res.status(500).json({ error }))
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id
	return userModel
		.findByIdAndDelete(id)
		.then((user) =>
			user ? res.status(200).json({ user }) : res.status(404).json({ message: 'not found' })
		)
		.catch((error) => res.status(500).json({ error }))
}

const findAllUser = async (req: Request, res: Response, next: NextFunction) => {
	return userModel
		.find()
		.then((users) => res.status(200).json({ users }))
		.catch((error) => res.status(500).json({ error }))
}

const findUserById = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id
	try {
		const user = await userModel.findById(id)
		return user ? res.status(200).json({ user }) : res.status(404).json({ message: 'not found' })
	} catch (error) {
		return res.status(500).json({ error })
	}
}

const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { userName, passWord } = req.body
		const user = await userModel.findOne({ userName })
		if (!user) {
			return res.status(400).json({ message: 'userName not found!' })
		}
		const isValid = await user.ischeckPassWord(passWord)
		if (!isValid) {
			return res.status(400).json({ message: 'wrong password!' })
		}
		
		const accessToken = await signAccessToken(user._id)
		const refreshToken = await signRefereshToken(user._id)
		const userNew = await userModel.findById(user._id)

		res.status(200).json({ accessToken, refreshToken, user: userNew })
	} catch (error) {
		return res.status(500).json({ error })
	}
}

const logout = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {refreshToken} = req.body
		
		if (!refreshToken) {
			return res.status(500).json({ message: 'refreshToken not found!' })
		}

		const { userId } = await verifiRefreshToken(refreshToken)

		userModel.findByIdAndUpdate(userId.toString(), { refreshToken: "" }, (err, docs) => {
			if (err) {
				Logging.error(err)
			} else {
				Logging.info('Updated : ' + docs)
			}
		})
		res.status(200).json({ message:"logout" })
	} catch (error) {
		return res.status(500).json({ error })
	}
}

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { refreshToken } = req.body
		if (!refreshToken) {
			return res.status(500).json({ message: 'no refreshToken' })
		}
		const { userId } = await verifiRefreshToken(refreshToken)
		const accessToken = await signAccessToken(userId)
		const _refreshToken = await signRefereshToken(userId)
		const user = await userModel.findById(userId) 
		return res.status(200).json({
			accessToken,
			refreshToken: _refreshToken,
			user
		})
	} catch (error) {
		return res.status(500).json({ error })
	}
}

export default {
	createUser,
	deleteUser,
	updateUser,
	findAllUser,
	findUserById,
	login,
	logout,
	refreshToken,
}
