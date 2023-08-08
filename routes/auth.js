import { Router } from 'express'
import { loginValidation, registerValidation } from '../validations'
import { checkAuth, handleValidationErrors } from '../utils'
import { UserController } from '../controllers'

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