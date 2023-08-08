import { Router } from 'express'
import * as PostController from '../controllers/PostController.js'
import * as CommentController from '../controllers/CommentController.js'
import { postCreateValidation } from '../validations.js'
import { checkAuth } from '../utils/checkAuth.js'
import { handleValidationErrors } from '../utils/handleValidationErrors.js'

const router = new Router()

// Get All Posts
// http://localhost:8080/api/posts
router.get('/', PostController.getAll)

// Get Post By Id
// http://localhost:8080/api/posts/:id
router.get('/:id', PostController.getOne)

// Create Post
// http://localhost:8080/api/posts
router.post('/', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)

// Remove Post
// http://localhost:8080/api/posts/:id
router.delete('/:id', checkAuth, PostController.remove)

// Update Post
// http://localhost:8080/api/posts/:id
router.patch('/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)

// Get Last Comment
// http://localhost:8080/api/posts
router.get('/lastcomments', CommentController.getPostComments)

export default router


