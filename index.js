import express from 'express'
import fs from 'fs'
import multer from 'multer'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import fileupload from 'express-fileupload'

import authRoute from './routes/auth.js'
import postRoute from './routes/posts.js'
import tagsRoute from './routes/tags.js'
import commentRoute from './routes/comments.js'
import { checkAuth } from './utils/checkAuth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
dotenv.config()
app.use(fileupload({}))

const PORT = process.env.PORT
const URL = process.env.URL

mongoose.set('strictQuery', false)
mongoose
	.connect(URL)
	.then(() => console.log('DB ok'))
	.catch((err) => console.log('DB error', err))
	

// const storage = multer.diskStorage({
// 	destination: (_, __, cb) => {
// 		if (!fs.existsSync('uploads')) {
// 			fs.mkdirSync('uploads')
// 		}
// 		cb(null, 'uploads')
// 	},
// 	filename: (_, file, cb) => {
// 		cb(null, file.originalname)
// 	},
// })

// const upload = multer({ storage })

app.use(express.json())
app.use(cors())

app.use(express.static(path.join(__dirname, './client/build')))
// app.use('/uploads', express.static(path.join(__dirname, './client/build/uploads')))

//Routs
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)
app.use('/api/tags', tagsRoute)
app.use('/api/comments', commentRoute)

// app.post('/api/upload', checkAuth, upload.single('image'), (req, res) => {
// 	res.json({
// 		url: `/uploads/${req.file.originalname}`,
// 	})
// })
app.post('/api/upload', checkAuth, (req, res) => {
	if (!req.files) {
		return res.status(400).json({ msg: 'No file uploaded' })
	}
	const file = req.files.image
	if (!file) return res.json({ error: 'Incorrect input name' })
	// const newFileName = encodeURI(Date.now() + '-' + file.name)
	const newFileName = encodeURI(file.name)
	file.mv(`${__dirname}/client/build/uploads/${newFileName}`, (err) => {
		if (err) {
			return res.status(500).send(err)
		}
		res.json({
			url: `/uploads/${newFileName}`,
		})
	})
})

app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, './client/build/index.html'))
})

app.listen(PORT || 4444, (err) => {
	if (err) {
		return console.log(err)
	}

	console.log(`Server started on port: ${PORT}`)
})
