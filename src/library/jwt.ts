import jwt, { Secret, SignOptions } from 'jsonwebtoken'
import userModel from '../models/user.model'
import Logging from './logging'

export const signAccessToken = async (userId: any) => {
	return new Promise((resovle, reject) => {
		const payload = {
			userId,
		}
		const secret: Secret = process.env.ACCESS_TOKEN_SECRET || ''
		const options: SignOptions = {
			expiresIn: '2h',
		}

		jwt.sign(payload, secret, options, (err, token) => {
			if (err) {
				reject(err)
			}
			resovle(token)
		})
	})
}

export const signRefereshToken = async (userId: any) => {
	return new Promise((resovle, reject) => {
		const payload = {
			userId,
		}
		const secret: Secret = process.env.REFRESH_TOKEN_SECRET || ''
		const options: SignOptions = {
			expiresIn: '1y',
		}

		jwt.sign(payload, secret, options, (err, token) => {
			if (err) {
				reject(err)
			}
			Logging.info(userId.toString())
			userModel.findByIdAndUpdate(userId.toString(), { refreshToken: token }, (err, docs) => {
				if (err) {
					Logging.error(err)
				} else {
					Logging.info('Updated : ' + docs)
				}
			})
			resovle(token)
		})
	})
}
