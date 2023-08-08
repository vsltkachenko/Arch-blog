import { Router } from 'express'
import * as CommentController from '../controllers/CommentController.js'
import { checkAuth } from '../utils/checkAuth.js'
const router = new Router()

// Create Comment
// http://localhost:8080/api/comments/:id
router.post('/:id', checkAuth, CommentController.createPostComment)

// Get Last Comments
// http://localhost:8080/api/comments/lastcomments
router.get('/lastcomments', CommentController.getLastComments)

export default router
