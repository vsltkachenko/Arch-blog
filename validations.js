import { body } from 'express-validator'

export const registerValidation = [
	body('email', 'Невірний формат пошти').isEmail(),
	body('password', 'Пароль повин бути мінімум 5 символів').isLength({ min: 5 }),
	body('fullName', "Вкажіть ім'я. Мінімум 3 символи").isLength({ min: 3 }),
	body('avatarUrl', 'Невірна ссилка на аватарку').optional().isURL(),
]

export const loginValidation = [
	body('email', 'Невірний формат пошти').isEmail(),
	body('password', 'Пароль повин бути мінімум 5 символів').isLength({ min: 5 }),
]

export const postCreateValidation = [
	body('title', 'Введіть загаловок статті').isLength({ min: 3 }).isString(),
	body('text', 'Ввведіть текст статті').isLength({ min: 3 }).isString(),
	body('tags', 'Невірний формат тегів').optional().isArray(),
	body('imageUrl', 'Невірна ссилка на зображення').optional().isString(),
]
