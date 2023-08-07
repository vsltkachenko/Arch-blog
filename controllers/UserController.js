import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import UserModel from '../models/User.js'

export const register = async (req, res) => {
	try {
		const password = req.body.password
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)

		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash: hash,
		})
		const user = await doc.save()

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{ expiresIn: '30d' }
		)

		const { passwordHash, ...userData } = user._doc

		res.json({
			...userData,
			token,
			message: 'Реєстрація пройшла успішно',
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Помилка реєстрації',
		})
	}
}

export const login = async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email })
		if (!user) {
			return res.status(404).json({
				message: `Користувача не знайдено`,
			})
		}

		const isValidPass = await bcrypt.compare(
			req.body.password,
			user._doc.passwordHash
		)
		if (!isValidPass) {
			return res.status(400).json({
				message: 'Невірний пароль',
			})
		}

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{ expiresIn: '30d' }
		)
		const { passwordHash, ...userData } = user._doc

		res.json({
			...userData,
			token,
			message: 'Ви увійшли в систему',
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Помилка авторизації' })
	}
}

export const getMe = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId)

		if (!user) {
			return res.status(404).json({
				message: "Користувача з таким ім'ям немає",
			})
		}

		const { passwordHash, ...userData } = user._doc

		res.json({
			...userData,
			message: 'Ви авторизовані!',
			// token,
		})
	} catch (error) {
		res.status(500).json({ message: 'Немає доступу' })
	}
}
