import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import path from 'path'
import fileupload from 'express-fileupload'
import { fileURLToPath } from 'url'
import authRoute from './routes/auth.js'
import postRoute from './routes/posts.js'
import tagsRoute from './routes/tags.js'
import commentRoute from './routes/comments.js'
import uploadRoute from './routes/upload.js'

const app = express()
dotenv.config()

const PORT = process.env.PORT
const URL = process.env.URL
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())
app.use(cors())
app.use(fileupload({}))
app.use(express.static('client/build'))

//Routs
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)
app.use('/api/tags', tagsRoute)
app.use('/api/comments', commentRoute)
app.use('/api/upload', uploadRoute)

app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, './client/build/index.html'))
})

mongoose.set('strictQuery', false)
mongoose
	.connect(URL)
	.then(() => console.log('DB ok'))
	.catch((err) => console.log('DB error', err))

app.listen(PORT || 4444, (err) => {
	if (err) {
		return console.log(err)
	}

	console.log(`Server started on port: ${PORT}`)
})
