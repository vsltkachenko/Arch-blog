import { Router } from 'express'
import { loginValidation, registerValidation } from '../validations.js'
import { checkAuth } from '../utils/checkAuth.js'
import { handleValidationErrors } from '../utils/handleValidationErrors.js'
import * as UserController from '../controllers/UserController.js'

const router = new Router()

// Register
// http://localhost:8080/api/auth/register
router.post('/register', registerValidation, handleValidationErrors, UserController.register)

//Login
// http://localhost:8080/api/auth/login
router.post('/login', loginValidation, handleValidationErrors, UserController.login)

//Get Me
// http://localhost:8080/api/auth/me
router.get('/me', checkAuth, UserController.getMe)



export default router