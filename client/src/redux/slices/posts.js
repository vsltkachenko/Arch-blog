import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../../axios'

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
	const { data } = await axios.get('/posts')
	return data
})
export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
	const { data } = await axios.get('/tags')
	return data
})
export const fetchRemovePost = createAsyncThunk(
	'posts/fetchRemovePost',
	async (id) => {
		const { data } = await axios.delete(`/posts/${id}`)
		return data
	}
)

const initialState = {
	posts: {
		items: [],
		status: 'loading',
	},
	popularPosts: {
		items: [],
		status: 'loading',
	},
	tags: {
		items: [],
		status: 'loading',
	},
}

const postSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {},
	extraReducers: {
		// Get All Posts
		[fetchPosts.pending]: (state) => {
			state.posts.items = []
			state.popularPosts.items = []
			state.posts.status = 'loading'
			state.popularPosts.status = 'loading'
		},
		[fetchPosts.fulfilled]: (state, action) => {
			state.posts.items = action.payload.posts
			state.popularPosts.items = action.payload.popularPosts
			state.posts.status = 'loaded'
			state.popularPosts.status = 'loaded'
		},
		[fetchPosts.rejected]: (state) => {
			state.posts.items = []
			state.popularPosts.items = []
			state.posts.status = 'error'
			state.popularPosts.status = 'error'
		},
		// Get Tags
		[fetchTags.pending]: (state) => {
			state.tags.items = []
			state.tags.status = 'loading'
		},
		[fetchTags.fulfilled]: (state, action) => {
			state.tags.items = action.payload.tags
			state.tags.status = 'loaded'
		},
		[fetchTags.rejected]: (state) => {
			state.tags.items = []
			state.tags.status = 'error'
		},
		// Remove Post
		[fetchRemovePost.pending]: (state) => {
			state.posts.status = 'loading'
		},
		[fetchRemovePost.fulfilled]: (state, action) => {
			if (action.payload.message === 'Пост видалено') {
				state.posts.items = state.posts.items.filter(
					(post) => post._id !== action.meta.arg
				)
				// alert('Пост видалено!')
			} else {
				alert('Пост не видалено!')
			}
			state.posts.status = 'loaded'
		},
		[fetchRemovePost.rejected]: (state) => {
			state.posts.status = 'error'
		},
	},
})

export const postsReducer = postSlice.reducer
