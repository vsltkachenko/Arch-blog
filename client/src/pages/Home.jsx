import React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Grid from '@mui/material/Grid'
import { Post } from '../components/Post'
import { TagsBlock } from '../components/TagsBlock'
import { CommentsBlock } from '../components/CommentsBlock'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts, fetchTags } from '../redux/slices/posts'
import { useParams } from 'react-router-dom'
import { getLastComments } from '../redux/slices/comments'

export const Home = () => {
	const dispatch = useDispatch()
	const [tab, setTab] = React.useState(0)
	const authUserId = useSelector((state) => state.auth.data?._id) //id авторизованого юзера
	let { posts, popularPosts, tags } = useSelector((state) => state.posts)
	let { lastComments, loading: isLastCommentsLoading } = useSelector(
		(state) => state.comments
	)
	const { tagname } = useParams()
	// console.log('tagName:', tagname)
	const isPostsloading =
		posts.status === 'loading' || popularPosts.status === 'loading'
	const isTagsloading = tags.status === 'loading'

	React.useEffect(() => {
		dispatch(fetchPosts())
		dispatch(fetchTags())
		dispatch(getLastComments())
	}, [dispatch])

	let postsWithTag =
		posts && tagname
			? posts.items.filter((post) => post.tags.includes(tagname))
			: null
	// console.log('postsWithTag:', postsWithTag)

	return (
		<>
			{tagname ? (
				<h3 style={{ color: 'gray' }}> {`Пости з тегом #${tagname}`}</h3>
			) : (
				<Tabs style={{ marginBottom: 15 }} value={tab} aria-label='basic tabs example'>
					<Tab onClick={() => setTab(0)} label='Нові' />
					<Tab onClick={() => setTab(1)} label='Популярні' />
				</Tabs>
			)}

			<Grid container spacing={4}>
				<Grid xs={8} item>
					{(isPostsloading ? [...Array(5)] : tab === 0 ? postsWithTag || posts.items : popularPosts.items).map((post, index) =>
						isPostsloading ? (
							<Post key={index} isLoading={true} />
						) : (
							<Post
								key={post._id}
								id={post._id}
								title={post.title}
								// imageUrl='https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png'
								imageUrl={post.imageUrl ? post.imageUrl : ''}
								user={post.user}
								createdAt={post.createdAt}
								viewsCount={post.viewsCount}
								commentsCount={3}
								tags={post.tags}
								// isLoading={true}
								isEditable={authUserId === post.user._id}
							/>
						)
					)}
				</Grid>
				<Grid xs={4} item>
					<TagsBlock items={tags.items} isLoading={isTagsloading} />
					<CommentsBlock
						// items={[
						// 	{
						// 		user: {
						// 			fullName: 'Вася Пупкин',
						// 			avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
						// 		},
						// 		text: 'Это тестовый комментарий',
						// 	},
						// 	{
						// 		user: {
						// 			fullName: 'Иван Иванов',
						// 			avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
						// 		},
						// 		text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
						// 	},
						// ]}
						items={lastComments}
						isLoading={isLastCommentsLoading}
					/> 
				</Grid>
			</Grid>
		</>
	)
}
