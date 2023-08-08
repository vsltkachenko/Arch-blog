import React from 'react'

import styles from './AddComment.module.scss'

import TextField from '@mui/material/TextField'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import { useDispatch, useSelector } from 'react-redux'
import { createPostComment } from '../../redux/slices/comments'
import { useParams } from 'react-router-dom'

const AddComment = () => {
	const dispatch = useDispatch()
	const params = useParams()

	const [comment, setComment] = React.useState('')
	const { data } = useSelector((state) => state.auth)

	const handleSubmit = () => {
		try {
			// data &&
			dispatch(
				createPostComment({ postId: params.id, comment, author: data._id })
			)
			setComment('')
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<>
			<div className={styles.root}>
				<Avatar classes={{ root: styles.avatar }} src={data.avatarUrl} />
				<form className={styles.form} onSubmit={(e) => e.preventDefault()}>
					<TextField
						label='Написати коментар'
						variant='outlined'
						maxRows={10}
						multiline
						fullWidth
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					/>
					<Button variant='contained' type='submit' onClick={handleSubmit}>
						Надіслати
					</Button>
				</form>
			</div>
		</>
	)
}
export default AddComment
