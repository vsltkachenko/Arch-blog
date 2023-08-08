import PostModel from '../models/Post.js'

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5).exec()

		const tags = Array.from(
			new Set(
				posts.map((post) => post.tags).flat()
				// .slice(0, 5)
			)
		)
		res.json({ tags })
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не вдалось отримати теги',
		})
	}
}
