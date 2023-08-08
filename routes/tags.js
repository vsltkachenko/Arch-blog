import { Router } from 'express'
import { getLastTags } from '../controllers/TagsController.js'

const router = new Router()

// Get Tags
// http://localhost:8080/api/posts/tags
router.get('/', getLastTags)

export default router
