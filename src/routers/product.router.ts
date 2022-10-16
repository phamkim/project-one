import express from 'express'
import productController from '../controllers/product.controller'
import { verifiAccessToken } from '../middleware/verifiToken'
const router = express.Router()

router.get('/', productController.findAllProduct)
router.get('/:id', productController.findProductById)
router.post('/', verifiAccessToken, productController.createProduct)
router.patch('/:id', verifiAccessToken, productController.updateProduct)
router.delete('/:id', verifiAccessToken, productController.deleteProduct)

export = router
