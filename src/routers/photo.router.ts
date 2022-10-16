import express from 'express'
import photoController from '../controllers/photo.controller'
import { upload } from '../library/upload'
import { verifiAccessToken } from '../middleware/verifiToken'

const router = express.Router()

router.get('/', photoController.findAllPhoto)
router.get('/:id', photoController.watchPhotoById)
router.post('/', upload.single('image'), photoController.createPhoto)
router.patch('/:id', verifiAccessToken, upload.single('image'), photoController.updatePhoto)
router.delete('/:id', verifiAccessToken, photoController.deletePhoto)

export = router
