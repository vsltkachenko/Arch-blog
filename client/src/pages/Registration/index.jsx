import React from 'react'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'

import styles from './Registration.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

export const Registration = () => {
	const isAuth = useSelector(selectIsAuth)
	const dispatch = useDispatch()
	let navigate = useNavigate()

	if (isAuth) {
		navigate('/', { replace: true })
	}
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		defaultValues: {
			fullName: 'John Smith',
			email: 'john@com.ua',
			password: '1234',
		},
		mode: 'onChange',
	})

	const onSubmit = async (values) => {
		const data = await dispatch(fetchRegister(values))
		if ('token' in data.payload) {
			window.localStorage.setItem('token', data.payload.token)
		}
	}

	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant='h5'>
				Створення акаунту
			</Typography>
			<div className={styles.avatar}>
				<Avatar sx={{ width: 100, height: 100 }} />
			</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					error={Boolean(errors.fullName?.message)}
					helperText={errors.fullName?.message}
					{...register('fullName', { required: "Вкажіть повне ім'я" })}
					className={styles.field}
					label="Повне ім'я"
					fullWidth
				/>
				<TextField
					error={Boolean(errors.email?.message)}
					helperText={errors.email?.message}
					type='email'
					{...register('email', { required: 'Вкажіть адресу пошти' })}
					className={styles.field}
					label='E-Mail'
					fullWidth
				/>
				<TextField
					// type='password'
					error={Boolean(errors.password?.message)}
					helperText={errors.password?.message}
					{...register('password', { required: 'Вкажіть пароль' })}
					className={styles.field}
					label='Пароль'
					fullWidth
				/>
				<Button
					disabled={!isValid}
					type='submit'
					size='large'
					variant='contained'
					fullWidth
				>
					Зареєструватися
				</Button>
			</form>
		</Paper>
	)
}
