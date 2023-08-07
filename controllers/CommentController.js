import Comment from '../models/Comment.js'
import Post from '../models/Post.js'

// Create Post Comment
export const createPostComment = async (req, res) => {
	try {
		const { postId, comment, author } = req.body

		if (!comment) return res.json({ message: 'Коментар не може бути порожнім' })

		const newComment = new Comment({ comment, author })

		await newComment.save()

		try {
			await Post.findByIdAndUpdate(postId, {
				$push: { comments: newComment._id },
			})
		} catch (error) {
			console.log(error)
		}
		const response = await newComment.populate('author')

		res.json(response)
	} catch (error) {
		res.json({ message: 'Коментар не створено!' })
	}
}

// Get Post Comments
export const getPostComments = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)
		const list = await Promise.all(
			post.comments.map((commentId) => {
				return Comment.findById(commentId).populate('author')
			})
		)
		res.json(list)
	} catch (error) {
		res.json({ message: 'Коментарі не отримано!' })
	}
}

// Get Last Comments
export const getLastComments = async (req, res) => {
	try {
		const comments = await Comment.find()
			.sort('-createdAt')
			.limit(5)
			.populate('author')

		res.json({ comments })
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не вдалось отримати останні коментарі',
		})
	}
}
