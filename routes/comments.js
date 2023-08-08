import { Router } from 'express'
import { CommentController } from '../controllers'
import { checkAuth } from '../utils'
const router = new Router()

// Create Comment
// http://localhost:8080/api/comments/:id
router.post('/:id', checkAuth, CommentController.createPostComment)

// Get Last Comments
// http://localhost:8080/api/comments/lastcomments
router.get('/lastcomments', CommentController.getLastComments)

export default router
