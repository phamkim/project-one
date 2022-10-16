import express from 'express'
import transactionController from '../controllers/transaction.controller'
import { verifiAccessToken } from '../middleware/verifiToken'
const router = express.Router()

router.get('/', verifiAccessToken, transactionController.findAllTransaction)
router.get('/:id', verifiAccessToken, transactionController.findTransactionById)
router.post('/', verifiAccessToken, transactionController.createTransaction)
router.patch('/:id', verifiAccessToken, transactionController.updateTransaction)
router.delete('/:id', verifiAccessToken, transactionController.deleteTransaction)

export = router
