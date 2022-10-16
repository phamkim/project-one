import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import Logging from '../library/logging'
import userModel from '../models/user.model'

export const verifiAccessToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.header('Authorization')?.replace('Bearer ', '')
		if (!token) {
			throw new Error()
		}
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || '', (err, payload) => {
			if (err) {
				if (err.name === 'JsonWebTokenError') {
					return res.status(401).json({ mesage: 'JsonWebTokenError' })
				}
				return res.status(401).json({ mesage: err.message })
			}
			req.jwtPayload = payload
			next()
		})
	} catch (err) {
		res.status(401).json({ mesage: 'Please authenticate' })
	}
}

export const verifiRefreshToken = async (refreshToken: string): Promise<JwtPayload> => {
	return new Promise((resovle, reject) => {
		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || '', async (err, payload) => {
			if (err) {
				Logging.info("ddd")
				return reject(err)
			}
			const result = payload as JwtPayload
			const { userId } = result
			const user = await userModel.findById(userId)

			if (user?.refreshToken === refreshToken) {
				return resovle(result)
			}
			return reject({ message: 'refreshToken faild!' })
		})
	})
}
