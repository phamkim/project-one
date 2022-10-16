import express from 'express'
import userController from '../controllers/user.controller'
import { Schemas, ValidateSchema } from '../middleware/validateSchema'
import { verifiAccessToken } from '../middleware/verifiToken'

const router = express.Router()

router.get('', userController.findAllUser)
router.get('/:id', verifiAccessToken, userController.findUserById)
router.patch(
	'/:id',
	ValidateSchema(Schemas.user.update),
	verifiAccessToken,
	userController.updateUser
)
router.delete('/:id', verifiAccessToken, userController.deleteUser)

// auth
router.post('/register', ValidateSchema(Schemas.user.create), userController.createUser)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.post('/refresh-token', userController.refreshToken)

export = router
