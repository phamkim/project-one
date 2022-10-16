import express from 'express'
import orderController from '../controllers/order.controller'
import { verifiAccessToken } from '../middleware/verifiToken'

const router = express.Router()

router.get('/', verifiAccessToken, orderController.findAllOrder)
router.get('/:id', verifiAccessToken, orderController.findOrderById)
router.post('/', verifiAccessToken, orderController.createOrder)
router.patch('/:id', verifiAccessToken, orderController.updateOrder)
router.delete('/:id', verifiAccessToken, orderController.deleteOrder)

export = router
