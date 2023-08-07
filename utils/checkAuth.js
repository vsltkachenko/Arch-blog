import jwt from 'jsonwebtoken'

export default (req, res, next) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
	console.log('token:', token)

	if (token) {
		try {
			console.log('tokenInTry:', token)
			const decoded = jwt.verify(token, process.env.JWT_SECRET)

			req.userId = decoded._id
			// console.log("token:", token, "id:", req.userId)
			next()
		} catch (error) {
			return res.status(403).json({
				message: 'Помилка токета доступу',
			})
		}
	} else {
		return res.status(403).json({
			message: 'Немає токена доступу',
		})
	}
}
