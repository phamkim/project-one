import Joi, { ObjectSchema } from 'joi'
import { NextFunction, Response, Request } from 'express'
import Logging from '../library/logging'
import { IUser } from '../models/user.model'

export const ValidateSchema = (schema: ObjectSchema) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.validateAsync(req.body)
			next()
		} catch (error) {
			Logging.error(error)
			return res.status(422).json({ error })
		}
	}
}

export const Schemas = {
	user: {
		create: Joi.object<IUser>({
			displayName: Joi.string().required(),
			userName: Joi.string()
				.regex(/^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/)
				.required(),
			passWord: Joi.string()
				.regex(/^(?=.*\d)(?=.*[a-z])(?=.*?[#?!@$%^&*-])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,16}$/)
				.required(),
			photo: Joi.string().required(),
			role: Joi.array(),
			refreshToken: Joi.string(),
		}),
		update: Joi.object<IUser>({
			displayName: Joi.string().required(),
			userName: Joi.string()
				.regex(/^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/)
				.required(),
			passWord: Joi.string()
				.regex(/^(?=.*\d)(?=.*?[#?!@$%^&*-])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,16}$/)
				.required(),
			photo: Joi.string().required(),
			role: Joi.array(),
			refreshToken: Joi.string(),
		}),
	},
}
