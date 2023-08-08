import React from 'react'

import { Post } from '../components/Post'
import AddComment from '../components/AddComment'
import { CommentsBlock } from '../components/CommentsBlock'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../axios'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsAuth } from '../redux/slices/auth'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { savePostComments } from '../redux/slices/comments'

export const FullPost = () => {
	const dispatch = useDispatch()
	const [post, setPost] = React.useState()
	const [isLoadingPost, setIsLoadingPost] = React.useState(true)
	const isAuth = useSelector(selectIsAuth)
	const { comments, loading: isCommentsLoading } = useSelector(
		(state) => state.comments
	)

	const { id } = useParams()
	const navigate = useNavigate()

	React.useEffect(() => {
		axios
			.get(`/posts/${id}`)
			.then((res) => {
				setPost(res.data)
				setIsLoadingPost(false)
				dispatch(savePostComments(res.data))
			})
			.catch((err) => {
				setIsLoadingPost(false)
				console.warn(err)
				alert('Помилка при отриманні статті', err)
				navigate('/')
			})

		// dispatch(getPostComments(id))
	}, [id, navigate, dispatch])

	return (
		<>
			{isLoadingPost ? (
				<Post isLoading={isLoadingPost} />
			) : (
				<Post
					id={post._id}
					title={post.title}
					// imageUrl='https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png'
					imageUrl={
						post.imageUrl ? post.imageUrl : ''
					}
					user={post.user}
					createdAt={post.createdAt}
					viewsCount={post.viewsCount}
					commentsCount={3}
					tags={post.tags}
					isFullPost
					isEditable={isAuth}
				>
					<ReactMarkdown>{post.text}</ReactMarkdown>
				</Post>
			)}

			 <CommentsBlock
				// items={[
				// 	{
				// 		user: {
				// 			fullName: 'Вася Пупкин',
				// 			avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
				// 		},
				// 		text: 'Это тестовый комментарий 555555',
				// 	},
				// 	{
				// 		user: {
				// 			fullName: 'Иван Иванов',
				// 			avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
				// 		},
				// 		text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
				// 	},
				// ]}
				items={comments}
				isLoading={isCommentsLoading}
			>
				{isAuth && <AddComment />}
			</CommentsBlock> 
		</>
	)
}
