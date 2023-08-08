import React from 'react'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import SimpleMDE from 'react-simplemde-editor'

import 'easymde/dist/easymde.min.css'
import styles from './AddPost.module.scss'
import { selectIsAuth } from '../../redux/slices/auth'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import axios from '../../axios'

export const AddPost = () => {
	const navigate = useNavigate()
	const isAuth = useSelector(selectIsAuth)
	const inputFileRef = React.useRef(null)
	const { id } = useParams()

	const [isLoading, setIsLoading] = React.useState(false)
	const [title, setTitle] = React.useState('')
	const [tags, setTags] = React.useState('')
	const [text, setText] = React.useState('')
	const [imageUrl, setImageUrl] = React.useState('')

	const isEditing = Boolean(id)

	React.useEffect(() => {
		const fetchData = async () => {
			if (isEditing) {
				const { data } = await axios.get(`/posts/${id}`)
				setTitle(data.title)
				setText(data.text)
				setTags(data.tags.join(', '))
				setImageUrl(data.imageUrl)
			}
		}
		fetchData()
	}, [isEditing, id])

	const handleChangeFile = async (event) => {
		// console.log(event.target.files)
		try {
			const formData = new FormData()
			const file = event.target.files[0]
			formData.append('image', file)
			const { data } = await axios.post('/upload', formData)
			// console.log('data:', data)
			setImageUrl(data.url)
		} catch (error) {
			console.warn(error)
			alert('ПОмилка при завантаженні файлу')
		}
	}

	const onClickRemoveImage = () => {
		setImageUrl('')
	}
	const onSubmit = async () => {
		try {
			// setIsLoading(true)
			const filds = {
				title,
				imageUrl,
				tags: tags.split(', '),
				text,
			}
			if (isEditing) {
				await axios.patch(`/posts/${id}`, filds)
				navigate(`/posts/${id}`)
			} else {
				const { data } = await axios.post('/posts', filds)
				navigate(`/posts/${data._id}`)
			}
			// console.log(data)
		} catch (error) {
			console.warn(error)
			alert('Помилка при створенні статті')
		}
	}

	const onChange = React.useCallback((text) => {
		setText(text)
	}, [])

	const options = React.useMemo(
		() => ({
			spellChecker: false,
			maxHeight: '400px',
			autofocus: true,
			placeholder: 'Введіть текст...',
			status: false,
			autosave: {
				enabled: true,
				delay: 1000,
			},
		}),
		[]
	)

	if (!window.localStorage.getItem('token') && !isAuth) {
		return <Navigate to='/' />
	}

	return (
		<Paper style={{ padding: '30px' }}>
			<Button onClick={() => inputFileRef.current.click()} variant='outlined' size='large'>
				{isEditing ? 'Змінити зображення' : 'Додати зображення'}
			</Button>
			<input ref={inputFileRef} type='file' onChange={handleChangeFile} hidden />
			{imageUrl && (
				<>
					<Button variant='contained' color='error' onClick={onClickRemoveImage}>
						Видалити
					</Button>
					<img className={styles.image} src={imageUrl} alt='Uploaded' />
				</>
			)}

			<br />
			<br />
			<TextField
				classes={{ root: styles.title }}
				variant='standard'
				placeholder='Заголовок статті...'
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				fullWidth
			/>
			<TextField
				classes={{ root: styles.tags }}
				variant='standard'
				placeholder='Теги'
				value={tags}
				onChange={(e) => setTags(e.target.value)}
				fullWidth
			/>
			<SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
			<div className={styles.buttons}>
				<Button onClick={onSubmit} size='large' variant='contained'>
					{isEditing ? 'Змінити' : 'Опублікувати'}
				</Button>
				<a href='/'>
					<Button size='large'>Відміна</Button>
				</a>
			</div>
		</Paper>
	)
}
