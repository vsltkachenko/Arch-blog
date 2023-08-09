import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const uploadFile = async (req, res) => {
	if (!req.files) {
		return res.status(400).json({ msg: 'No file uploaded' })
	}
	const file = req.files.image
	if (!file) return res.json({ error: 'Incorrect input name' })
	// const newFileName = encodeURI(Date.now() + '-' + file.name)
	const newFileName = encodeURI(file.name)
	file.mv(path.join(__dirname, '..', 'client', 'build', 'uploads', fileName), (err) => {
		if (err) {
			return res.status(500).send(err)
		}
		res.json({
			url: `/uploads/${newFileName}`,
		})
	})
}
