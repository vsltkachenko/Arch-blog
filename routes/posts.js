import { Router } from 'express'
import { CommentController, PostController } from '../controllers'
import { checkAuth, handleValidationErrors } from '../utils'
import { postCreateValidation } from '../validations'

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

// Get Tags
// http://localhost:8080/api/posts/tags
router.get('/tags', PostController.getLastTags)

// Get Last Comment
// http://localhost:8080/api/posts
router.get('/lastcomments', CommentController.getPostComments)

const router = new Router()
