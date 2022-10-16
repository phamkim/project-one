import express from 'express'
import categoryController from '../controllers/category.controller'
import { verifiAccessToken } from '../middleware/verifiToken'

const router = express.Router()

router.get('/', categoryController.findAllCategory)
router.get('/:id', categoryController.findCategoryById)
router.post('/', verifiAccessToken, categoryController.createCategory)
router.patch('/:id', verifiAccessToken, categoryController.updateCategory)
router.delete('/:id', verifiAccessToken, categoryController.deleteCategory)

export = router
