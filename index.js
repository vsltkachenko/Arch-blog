import express from 'express'
import fs from 'fs'
import multer from 'multer'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'

import {
	registerValidation,
	loginValidation,
	postCreateValidation,
} from './validations.js'

import { handleValidationErrors, checkAuth } from './utils/index.js'

import {
	UserController,
	PostController,
	CommentController,
} from './controllers/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
dotenv.config()

const PORT = process.env.PORT
const URL = process.env.URL

mongoose.set('strictQuery', false)
mongoose
	.connect(URL)
	.then(() => console.log('DB ok'))
	.catch((err) => console.log('DB error', err))

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		if (!fs.existsSync('uploads')) {
			fs.mkdirSync('uploads')
		}
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	},
})

const upload = multer({ storage })

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, './client/build')))
app.use('/uploads', express.static('uploads'))

app.post(
	'/api/auth/login',
	loginValidation,
	handleValidationErrors,
	UserController.login
)
app.post(
	'/api/auth/register',
	registerValidation,
	handleValidationErrors,
	UserController.register
)
app.get('/api/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
})

app.get('/api/posts', PostController.getAll)
// app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.post(
	'/api/posts',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.create
)
app.delete('/api/posts/:id', checkAuth, PostController.remove)
app.patch(
	'/api/posts/:id',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.update
)
app.get('/api/tags', PostController.getLastTags)

// Comments
app.post('/api/comments/:id', checkAuth, CommentController.createPostComment)
app.get('/api/posts/comments/:id', CommentController.getPostComments)
app.get('/api/lastcomments', CommentController.getLastComments)

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, './client/build/index.html'))
})

app.listen(PORT || 4444, (err) => {
	if (err) {
		return console.log(err)
	}

	console.log(`Server started on port: ${PORT}`)
})
