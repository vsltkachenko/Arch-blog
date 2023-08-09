import { Router } from 'express'
import { uploadFile } from '../controllers/UploadFileController.js'
import { checkAuth } from '../utils/checkAuth.js'

const router = new Router()

// Get Tags
// http://localhost:8080/api/upload
router.post('/', checkAuth, uploadFile)

export default router
