import Logging from '../library/logging'
import userModel, { Role } from '../models/user.model'

const isUser = async (userId: String): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		Logging.info(userId)
		userModel
			.findById(userId)
			.then((user) => {
				var istrue: boolean = false
				Logging.info(user)

				user?.role.forEach((element) => {
					if (element === Role.USER) {
						Logging.info(element)
						istrue = true
					}
				})

				resolve(istrue)
			})
			.catch((err) => {
				reject(err)
			})
	})
}

const isEmployee = async (userId: String): Promise<boolean> => {
	return new Promise((resolve, rejects) => {})
}

const isAdmin = async (userId: String): Promise<boolean> => {
	return new Promise((resolve, rejects) => {})
}

export { isUser, isAdmin, isEmployee }
