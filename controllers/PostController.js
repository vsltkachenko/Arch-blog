import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find()
			.sort('-createdAt')
			.populate('user')
			.exec()
		const popularPosts = await PostModel.find()
			.sort('-viewsCount')
			.limit(3)
			.populate('user')
			.exec()

		res.json({ posts, popularPosts })
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не вдалось отримати пости',
		})
	}
}

export const remove = async (req, res) => {
	try {
		const postId = req.params.id
		PostModel.findOneAndDelete(
			{
				_id: postId,
			},
			(err, doc) => {
				if (err) {
					console.log(error)
					return res.status(500).json({
						message: 'Не вдалось видалити пост',
					})
				}
				if (!doc) {
					return res.status(404).json({
						message: 'Пост не знайдено',
					})
				}
				res.json({
					message: 'Пост видалено',
				})
			}
		)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Помилка при видаленні поста',
		})
	}
}
export const getOne = async (req, res) => {
	try {
		const postId = req.params.id
		PostModel.findOneAndUpdate(
			{ _id: postId },
			{ $inc: { viewsCount: 1 } },
			{
				returnDocument: 'after',
				// , populate: { path: 'user' }
			},
			async (err, doc) => {
				if (err) {
					console.log(error)
					return res.status(500).json({
						message: 'Не вдалось повернути пост',
					})
				}
				if (!doc) {
					return res.status(404).json({
						message: 'Пост не знайдено',
					})
				}

				res.json(
					await doc.populate({
						path: 'comments',
						populate: { path: 'author' },
					})
				)
			}
		).populate('user')
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не вдалось отримати пост',
		})
	}
}

export const create = async (req, res) => {
	try {
		const { title, text, imageUrl, tags } = req.body

		const doc = new PostModel({
			title,
			text,
			imageUrl,
			tags,
			user: req.userId,
		})

		const post = await doc.save()
		res.json(post)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не вдалось створити пост',
		})
	}
}

export const update = async (req, res) => {
	try {
		const postId = req.params.id
		const { title, text, imageUrl, tags } = req.body
		await PostModel.findOneAndUpdate(
			{ _id: postId },
			{ title, text, imageUrl, tags, user: req.userId }
		)
		res.json({
			message: 'Пост оновлено!',
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не вдалось оновити пост',
		})
	}
}

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5).exec()

		const tags = Array.from(
			new Set(
				posts.map((post) => post.tags).flat()
				// .slice(0, 5)
			)
		)

		res.json(tags)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не вдалось отримати теги',
		})
	}
}
